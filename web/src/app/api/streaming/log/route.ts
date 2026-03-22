export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const encoder = new TextEncoder();

type BuildStage = "SCM" | "BUILD" | "DEPLOY";
type StreamState = "success" | "error" | "progess" | "progress";

type ProgressPayload = {
  type: BuildStage;
  delta: string;
  length: number;
};

type EndPayload = {
  success: boolean;
  message: string;
};

const STREAM_DELAY_MS = 180;
const END_EVENT_GRACE_MS = 1500;
const RETRY_DELAY_MS = 1000 * 60 * 60;
const BUILD_STAGES: BuildStage[] = ["SCM", "BUILD", "DEPLOY"];

const BUILD_LOGS: Record<BuildStage, string[]> = {
  SCM: [
    "Started by user admin\n",
    "Running as SYSTEM\n",
    "Building in workspace /var/jenkins_home/workspace/my-project-pipeline\n",
    "\n[Pipeline] Start of Pipeline\n",
    "[Pipeline] node\n",
    "Running on Jenkins-Agent-1 in /var/jenkins_home/workspace/my-project-pipeline\n",
    "\n[Pipeline] stage\n",
    "[Pipeline] { (SCM Checkout)\n",
    "\n[SCM] Initializing Git repository...\n",
    " > git init /var/jenkins_home/workspace/my-project-pipeline # timeout=10\n",
    "Fetching upstream changes from https://github.com/org/repo.git\n",
    " > git --version # 'git version 2.34.1'\n",
    " > git fetch --tags --progress origin +refs/heads/*:refs/remotes/origin/*\n",
    "\nChecking out Revision 8f3a9d1c6b72e0c9d2d9b2c4e6d9e5b2f4c1a8e1 (origin/main)\n",
    "\n[SCM] Cleaning workspace before checkout...\n > git reset --hard\n > git clean -fdx\n",
    "\n[SCM] Resolving submodules...\n > git submodule sync\n > git submodule update --init --recursive\n",
    "\n[SCM] Detecting LFS files...\n > git lfs install\n > git lfs pull\n",
    '\n[SCM] Applying sparse checkout rules...\n > git config core.sparseCheckout true\n > echo "apps/frontend/*" >> .git/info/sparse-checkout\n > echo "apps/backend/*" >> .git/info/sparse-checkout\n',
    "\n[SCM] Verifying commit signature...\nCommit 8f3a9d1 verified with GPG key ID 4AEE18F83AFDEB23\n",
    "\n[SCM] Running pre-checkout hook...\nExecuting scripts/pre-checkout.sh\n✔ Environment validation passed\n✔ Required secrets found\n",
    "\n[SCM] Checkout complete\n",
    "\n[Pipeline] }\n",
  ],
  BUILD: [
    "[Pipeline] stage\n",
    "[Pipeline] { (Build)\n",
    "\n[Build] Installing dependencies...\n",
    "\n[Build] Using Node.js v20.10.0\n",
    " > npm ci --prefer-offline --no-audit\n",
    "\nadded 1243 packages in 18s\n",
    "\n[Build] Running lint checks...\n",
    " > npm run lint\n",
    "\n✔ No ESLint warnings or errors\n",
    "\n[Build] Running unit tests...\n > npm run test\n",
    "\n PASS  src/utils/parser.test.ts\n PASS  src/services/user.service.test.ts\n PASS  src/controllers/auth.controller.test.ts\n",
    "\nTest Suites: 12 passed, 12 total\nTests:       148 passed, 148 total\nSnapshots:   0 total\nTime:        6.341 s\n",
    "\n[Build] Running integration tests...\n > npm run test:integration\n",
    "\nConnecting to test database...\nDatabase connection established\n",
    "\n PASS  test/integration/auth.int.test.ts\n PASS  test/integration/order.int.test.ts\n",
    "\nTest Suites: 5 passed, 5 total\nTests:       42 passed, 42 total\n",
    "\n[Build] Running build step...\n > npm run build\n",
    "\ninfo  - Using Next.js 14.1.0\ninfo  - Creating an optimized production build...\n\nCompiled successfully.\n",
    "\n[Build] Generating artifacts...\n > tar -czf build-artifact.tar.gz .next node_modules package.json\n\n✔ Artifact created: build-artifact.tar.gz (42MB)\n",
    "\n[Build] Uploading artifact to internal storage...\n > curl -X POST https://artifact.internal/upload \\\n   -F file=@build-artifact.tar.gz\n",
    "\n✔ Artifact upload success (HTTP 200)\n",
    "\n[Pipeline] }\n",
  ],
  DEPLOY: [
    "[Pipeline] stage\n",
    "[Pipeline] { (Deploy via SSH)\n",
    "\n[Deploy] Starting SSH deployment...\n",
    "\n[Deploy] Connecting to remote server...\n",
    " > ssh -i /var/jenkins_home/.ssh/id_rsa deploy@192.168.0.12\n",
    "\nConnected to 192.168.0.12\n",
    "\n[Deploy] Creating backup of current release...\n > cp -r /var/www/app/current /var/www/app/backup_$(date +%Y%m%d%H%M%S)\n",
    "\n✔ Backup completed\n",
    "\n[Deploy] Downloading artifact from storage...\n > curl -o build-artifact.tar.gz https://artifact.internal/download/latest\n",
    "\n✔ Download complete\n",
    "\n[Deploy] Extracting artifact...\n > tar -xzf build-artifact.tar.gz -C /var/www/app/releases/new\n",
    "\n✔ Extraction complete\n",
    "\n[Deploy] Running database migrations...\n > docker exec app-container npm run migrate\n",
    "\n✔ Migration completed\n",
    "\n[Deploy] Switching symlink to new release...\n > ln -sfn /var/www/app/releases/new /var/www/app/current\n",
    "\n✔ Symlink updated\n",
    "\n[Deploy] Restarting application...\n > docker-compose -f docker-compose.prod.yml down\n > docker-compose -f docker-compose.prod.yml up -d\n",
    "\n✔ Containers restarted\n",
    "\n[Deploy] Running health check...\n > curl -f http://localhost:3000/health\n\n✔ Health check passed\n",
    "\n[Deploy] Cleaning old releases...\n > ls -dt /var/www/app/releases/* | tail -n +6 | xargs rm -rf\n\n✔ Old releases cleaned\n",
    "\n[Deploy] Deployment completed successfully\n",
    "\n[Pipeline] }\n[Pipeline] End of Pipeline\n\nFinished: SUCCESS\n",
  ],
};

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const buildProgressEvents = (startStage: BuildStage) => {
  const stageStartIndex = BUILD_STAGES.indexOf(startStage);
  const progressEvents: ProgressPayload[] = [];
  let length = 0;

  for (const stage of BUILD_STAGES.slice(stageStartIndex)) {
    for (const delta of BUILD_LOGS[stage]) {
      length += delta.length;
      progressEvents.push({
        type: stage,
        delta,
        length,
      });
    }
  }

  return progressEvents;
};

const toSSEEvent = (eventName: string, data: object | null) =>
  `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
const toSSERetry = (retryMs: number) => `retry: ${retryMs}\n\n`;

const createEndPayload = (state: StreamState): EndPayload => {
  if (state === "error") {
    return {
      success: false,
      message: "실패했어요 ㅜㅜ",
    };
  }

  return {
    success: true,
    message: "성공했어요!",
  };
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const stateParam = searchParams.get("state");
  const state: StreamState =
    stateParam === "error" ||
    stateParam === "success" ||
    stateParam === "progess" ||
    stateParam === "progress"
      ? stateParam
      : "success";

  const shouldSkipStart = state === "progess" || state === "progress";
  const startStage: BuildStage = shouldSkipStart ? "BUILD" : "SCM";
  const progressEvents = buildProgressEvents(startStage);
  const endPayload = createEndPayload(state);

  let closed = false;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (payload: string) => {
        if (closed) return;
        controller.enqueue(encoder.encode(payload));
      };

      const close = () => {
        if (closed) return;
        closed = true;
        controller.close();
      };

      const abort = () => {
        closed = true;
        try {
          controller.close();
        } catch {
          // Ignore close races after client disconnects.
        }
      };

      request.signal.addEventListener("abort", abort);

      void (async () => {
        try {
          send(toSSERetry(RETRY_DELAY_MS));

          if (!shouldSkipStart) {
            send(toSSEEvent("start", null));
            await sleep(STREAM_DELAY_MS);
          }

          for (const event of progressEvents) {
            send(toSSEEvent("progress", event));
            await sleep(STREAM_DELAY_MS);
          }

          send(toSSEEvent("end", endPayload));
          await sleep(END_EVENT_GRACE_MS);
        } finally {
          request.signal.removeEventListener("abort", abort);
          close();
        }
      })();
    },
  });

  return new Response(stream, {
    headers: {
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Content-Type": "text/event-stream; charset=utf-8",
      "X-Accel-Buffering": "no",
    },
  });
}
