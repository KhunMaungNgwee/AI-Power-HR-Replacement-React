import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

type SelectPropsType = {
  placeholder: string;
  options: { label: string; value: string; icon?: React.ReactNode }[];
  label?: string;
  placeholderIcon?: React.ReactNode;
  classes?: string;
  value?: string;
  onChange?: (value: string) => void;
};

export function SelectBox({
  placeholder,
  options,
  label,
  placeholderIcon,
  classes,
  value,
  onChange,
}: SelectPropsType) {
  const { t } = useTranslation();
  return (
    <Select onValueChange={(value) => onChange?.(value)} value={value}>
      <SelectTrigger className={cn(`${classes ? "w-[180px]" : ""}`, classes)}>
        <SelectValue placeholder={t(placeholder)} />
        {placeholderIcon && <span className="ms-2">{placeholderIcon}</span>}
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label ? t(label) : ""}</SelectLabel>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option?.icon} {t(option.label)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
