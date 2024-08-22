import { formatFractionDigits } from "@/lib/utils";
import CurrecnyInput from "react-currency-input-field";

type Props = {
  value: number;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
  prefix?: string;
  intlConfig?: {
    locale: string;
    currency: string;
  };
};

export default function AmountInput({
  value,
  onChange,
  disabled,
  placeholder,
  prefix,
  intlConfig,
}: Props) {
  return (
    <div>
      <CurrecnyInput
        intlConfig={intlConfig}
        prefix={prefix}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder={placeholder}
        value={value}
        decimalsLimit={3}
        decimalScale={formatFractionDigits(+value)}
        onValueChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}
