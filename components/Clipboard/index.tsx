import React from "react";
import { IconButton, Tooltip, useClipboard } from "@chakra-ui/react";
import { CopyIcon, CheckIcon } from "@chakra-ui/icons";

interface ClipboardProps {
  value: string;
  ariaLabel: string;
}

const Clipboard: React.FC<ClipboardProps> = ({ value, ariaLabel }) => {
  const { hasCopied, onCopy } = useClipboard(value);

  return (
    <Tooltip label={hasCopied ? "Copied!" : "Copy"} closeOnClick={false}>
      <IconButton
        aria-label={ariaLabel}
        icon={hasCopied ? <CheckIcon /> : <CopyIcon />}
        onClick={onCopy}
        size="xs"
        variant="outline"
      />
    </Tooltip>
  );
};

export default Clipboard;
