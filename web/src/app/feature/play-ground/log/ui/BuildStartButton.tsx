"use client";

import Button from "@/app/shared/ui/atom/button";

export type BuildStartType = "success" | "error" | "inprogress";

type BuildStartButtonProps = {
  type: BuildStartType;
  onStart: (type: BuildStartType) => void;
  disabled?: boolean;
};

const buttonLabelMap: Record<BuildStartType, string> = {
  success: "빌드 시작(success)",
  error: "빌드 시작(error)",
  inprogress: "빌드 시작(if inprogess)",
};

const buttonToneMap: Record<BuildStartType, "primary" | "error" | "cancel"> = {
  success: "primary",
  error: "error",
  inprogress: "cancel",
};

export function BuildStartButton({
  type,
  onStart,
  disabled = false,
}: BuildStartButtonProps) {
  return (
    <Button
      type={buttonToneMap[type]}
      htmlType="button"
      disabled={disabled}
      onClick={() => onStart(type)}
    >
      {buttonLabelMap[type]}
    </Button>
  );
}

export default BuildStartButton;
