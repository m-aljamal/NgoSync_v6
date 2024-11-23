"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function useSelectFilter({ name }: { name: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value !== "ALL") {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const defaultValue = searchParams.get(name);

  return { handleSelect, defaultValue };
}
