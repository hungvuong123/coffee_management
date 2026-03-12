import { useState, useRef, useEffect } from "react";
import { Box, TextField } from "@mui/material";
import './index.scss'

const OTP_LENGTH = 6;

export default function VerifyCode({
  onVerify,
}: {
  onVerify?: (code: string) => void;
}) {
  const [code, setCode] = useState<string[]>(Array(OTP_LENGTH).fill(""));

  const inputs = useRef<HTMLInputElement[]>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const paste = e.clipboardData.getData("text").slice(0, OTP_LENGTH);
    if (!/^\d+$/.test(paste)) return;

    const newCode = paste.split("");
    setCode(newCode);

    newCode.forEach((digit, i) => {
      if (inputs.current[i]) inputs.current[i].value = digit;
    });
  };

  const otpCode = code.join("");

  // auto verify
  useEffect(() => {
    if (otpCode.length === OTP_LENGTH && !code.includes("")) {
      onVerify?.(otpCode);
    }
  }, [otpCode]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
      <div className="verify-title">Nhập mã xác thực</div>

      <Box display="flex" gap={2} onPaste={handlePaste}>
        {code.map((digit, index) => (
          <TextField
            key={index}
            defaultValue={digit}
            inputRef={(el) => {
              if (el) inputs.current[index] = el;
            }}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            inputProps={{
              maxLength: 1,
              style: {
                textAlign: "center",
                fontSize: "24px",
                width: "48px",
                height: "48px",
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
