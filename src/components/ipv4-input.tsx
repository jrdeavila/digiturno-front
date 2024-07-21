// components/IPv4Input.tsx
import React, { useState, ChangeEvent } from "react";
import { Input, InputProps } from "@nextui-org/react";

interface IPv4InputProps extends InputProps {}

const IPv4Input: React.FC<IPv4InputProps> = (props) => {
  const [value, setValue] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formattedValue = formatIPv4(inputValue);
    setValue(formattedValue);
    props.onChange?.(e);
  };

  const formatIPv4 = (input: string) => {
    const regex = /^(\d{1,3}\.){0,3}\d{0,3}$/;
    if (!regex.test(input)) return value;
    const parts = input.split(".");
    const formattedParts = parts.map((part) =>
      part.length > 1 && part.startsWith("0") ? part.slice(1) : part
    );
    return formattedParts.join(".");
  };

  return <Input {...props} value={value} onChange={handleChange} />;
};

export default IPv4Input;
