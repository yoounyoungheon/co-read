# GCP + Gabia + Vercel DNS Signaling 배포 가이드

이 문서는 현재 프로젝트의 signaling 서버를 GCP VM에 배포하고, 가비아에서 구매한 도메인을 Vercel DNS로 관리하면서 HTTPS reverse proxy를 붙인 과정을 순서대로 정리한다.

대상 구성:

- signaling 서버: Docker 이미지 `yoonyounghun/signaling`
- 배포 위치: GCP Compute Engine VM
- 도메인: `signaling.iamyounghun.co.kr`
- 도메인 구매처: 가비아
- authoritative DNS: Vercel DNS
- reverse proxy / TLS: nginx + certbot
- 프론트 signaling 접속 주소:
  - `https://signaling.iamyounghun.co.kr/api/ws/consulting-room`

## 1. GCP VM 생성

Always Free에 최대한 맞추려면 미국 리전의 `e2-micro`를 사용한다.

```bash
gcloud compute instances create signaling-vm \
  --zone=us-west1-a \
  --machine-type=e2-micro \
  --image-family=ubuntu-2204-lts \
  --image-project=ubuntu-os-cloud \
  --boot-disk-size=20GB \
  --boot-disk-type=pd-standard \
  --tags=signaling-server
```

생성 확인:

```bash
gcloud compute instances list
```

SSH 접속:

```bash
gcloud compute ssh signaling-vm --zone=us-west1-a
```

## 2. GCP 방화벽 열기

아래 명령은 VM 안이 아니라 Cloud Shell 또는 로컬 터미널에서 실행한다.

8080 포트:

```bash
gcloud compute firewall-rules create allow-signaling-8080 \
  --allow=tcp:8080 \
  --target-tags=signaling-server
```

80 포트:

```bash
gcloud compute firewall-rules create allow-http-80 \
  --allow=tcp:80 \
  --target-tags=signaling-server
```

443 포트:

```bash
gcloud compute firewall-rules create allow-https-443 \
  --allow=tcp:443 \
  --target-tags=signaling-server
```

확인:

```bash
gcloud compute firewall-rules list
```

## 3. DNS 설정

`iamyounghun.co.kr` 도메인은 가비아에서 구매했지만, 실제 DNS authoritative 서버는 Vercel이다.

즉 DNS 레코드는 가비아가 아니라 **Vercel DNS**에서 관리 중이다.

## 4. signaling 이미지 실행

현재 배포 이미지는 아래를 사용한다.

- `yoonyounghun/signaling:latest`

단일 컨테이너 실행:

```bash
docker run -d \
  --name signaling \
  --restart unless-stopped \
  -p 8080:8080 \
  -e PORT=8080 \
  -e CLIENT_ORIGINS="https://iamyounghun.co.kr,http://localhost:3000" \
  yoonyounghun/signaling:latest
```

컨테이너 확인:

```bash
docker ps
docker logs signaling
```

## 5. nginx reverse proxy 설정

설정 파일 생성:

```bash
sudo tee /etc/nginx/sites-available/signaling > /dev/null <<'EOF'
server {
    listen 80;
    server_name signaling.iamyounghun.co.kr;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
EOF
```

기본 사이트 제거:

```bash
sudo rm -f /etc/nginx/sites-enabled/default
```

활성화:

```bash
sudo ln -s /etc/nginx/sites-available/signaling /etc/nginx/sites-enabled/signaling
```

검증:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

HTTP 확인:

브라우저에서 아래 URL에 접속해 JSON 응답이 보이면 정상이다.

```text
http://signaling.iamyounghun.co.kr
```

응답 예시:

```json
{
  "ok": true
}
```

## 6. HTTPS 인증서 적용

certbot 설치:

```bash
sudo apt update
sudo apt install -y certbot python3-certbot-nginx
```

인증서 발급:

```bash
sudo certbot --nginx -d signaling.iamyounghun.co.kr
```

## 7. 프론트 signaling 접속 주소 변경

현재 프론트는 `web/src/app/shared/rtc/useRtc.tsx`의 `SIGNALING_SERVER_URL`을 사용한다.

최종 운영 주소:

```ts
https://signaling.iamyounghun.co.kr/api/ws/consulting-room
```

현재 코드 형태:

```ts
const SIGNALING_SERVER_URL =
  process.env.NEXT_PUBLIC_RTC_SIGNALING_URL ??
  "https://signaling.iamyounghun.co.kr/api/ws/consulting-room";
```

즉 운영에서는 환경변수로 덮어쓸 수도 있고, 기본값으로도 동작하게 둘 수 있다.

## 10. Compose 파일

최종적으로 사용할 수 있는 compose 파일 예시는 아래와 같다.

파일 위치 예시:

- `signaling/docker-compose.yml`

내용:

```yaml
version: "3.3"

services:
  signaling:
    image: yoonyounghun/signaling:latest
    container_name: signaling
    restart: unless-stopped
    ports:
      - "8080:8080"
    environment:
      PORT: "8080"
      CLIENT_ORIGINS: "https://iamyounghun.co.kr,http://localhost:3000"
```

실행:

```bash
docker compose up -d
```

## 11. 운영 체크리스트

- GCP VM이 실제로 떠 있는지 확인
- 8080, 80, 443 방화벽 규칙이 열려 있는지 확인
- `signaling.iamyounghun.co.kr` DNS가 authoritative DNS 기준으로 VM IP를 가리키는지 확인
- nginx가 `127.0.0.1:8080`으로 reverse proxy 중인지 확인
- certbot 인증서가 발급됐는지 확인
- 프론트가 `https://signaling.iamyounghun.co.kr/api/ws/consulting-room`를 사용 중인지 확인

## 12. 자주 맞닥뜨린 문제

### 1. Cloud Shell에서 `systemctl`이 안 되는 경우

이 경우는 VM이 아니라 Cloud Shell 안에 있기 때문이다.

- Cloud Shell: GCP 관리용
- 실제 VM: nginx, Docker, signaling 실행용

### 2. `docker-compose` 버전 충돌

구형 `docker-compose`는 최신 Docker Engine과 API 버전 충돌을 일으킬 수 있다.

권장:

```bash
docker compose version
```

그리고:

```bash
docker compose up -d
```

### 3. `permission denied while trying to connect to the docker API`

현재 사용자가 docker 소켓 권한이 없는 상태다.

해결:

```bash
sudo usermod -aG docker $USER
newgrp docker
```

또는 일단:

```bash
sudo docker compose up -d
```

### 4. HTTPS 프론트에서 HTTP signaling이 막히는 경우

이건 mixed content 문제다.

- `https://` 프론트
- `http://` signaling

조합이면 브라우저가 차단할 수 있다.

따라서 운영에서는 반드시 아래처럼 맞춘다.

```text
https://signaling.iamyounghun.co.kr/api/ws/consulting-room
```

### 5. 가비아에 레코드를 넣었는데 실제 조회 결과가 다를 때

이 경우는 대체로 authoritative DNS가 가비아가 아닌 상태다.

예를 들어:

```bash
dig NS iamyounghun.co.kr
```

결과가 아래처럼 나오면:

```text
ns1.vercel-dns.com.
ns2.vercel-dns.com.
```

- 실제 DNS는 Vercel이 관리 중이다.
- 따라서 `signaling` 레코드도 Vercel DNS에서 수정해야 한다.
- 가비아에 설정된 `A` 레코드는 반영되지 않는다.
