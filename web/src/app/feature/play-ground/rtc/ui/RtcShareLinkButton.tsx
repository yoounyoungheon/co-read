"use client";

import { useEffect, useState } from "react";
import Button from "@/app/shared/ui/atom/button";

const DEFAULT_LABEL = "동료한테 링크를 전달하세요";
const SUCCESS_LABEL = "링크가 복사되었어요";
const FAIL_LABEL = "복사에 실패했어요";
const UNSUPPORTED_LABEL = "지원하지 않는 환경이에요!";

export function RtcShareLinkButton() {
  const [label, setLabel] = useState(DEFAULT_LABEL);

  useEffect(() => {
    if (label === DEFAULT_LABEL) {
      return;
    }

    const timer = window.setTimeout(() => {
      setLabel(DEFAULT_LABEL);
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [label]);

  const handleCopy = async () => {
    if (
      typeof window === "undefined" ||
      typeof navigator === "undefined" ||
      !navigator.clipboard
    ) {
      setLabel(UNSUPPORTED_LABEL);
      return;
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      setLabel(SUCCESS_LABEL);
    } catch {
      setLabel(FAIL_LABEL);
    }
  };

  return (
    <Button
      htmlType="button"
      type="cancel"
      variant="outline"
      onClick={() => void handleCopy()}
    >
      {label}
    </Button>
  );
}

export default RtcShareLinkButton;
