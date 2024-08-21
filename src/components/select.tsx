"use client"

import { useMemo } from "react"
import Select, { type SingleValue } from "react-select"
import CreateableSelect from "react-select/creatable"

type Props = {
  onChange: (value?: string | null) => void
  onCreate?: (value: string) => void
  options?: { value: string; label: string }[]
  value?: string | null | undefined
  disabled?: boolean
  placeholder?: string
  creatable?: boolean
  isLoading?: boolean
}

export const AppSelect = ({
  onChange,
  onCreate,
  options = [],
  value,
  disabled,
  placeholder,
  creatable = false,
  isLoading,
}: Props) => {
  const onSelect = (
    option: SingleValue<{ value: string; label: string }> | null
  ) => {
    onChange(option ? option.value : null)
  }
  const formattedValue = useMemo(() => {
    return options.find((option) => option.value === value) || null
  }, [value, options])
  return (
    <>
      {creatable ? (
        <CreateableSelect
          menuPlacement="auto"
          maxMenuHeight={150}
          placeholder={placeholder}
          className="h-10 text-sm"
          styles={{
            container: (base) => ({
              ...base,
              borderColor: "#e2e8f0",
              ":hover": {
                borderColor: "#e2e8f0",
              },
            }),
          }}
          value={formattedValue}
          onChange={onSelect}
          options={options}
          onCreateOption={onCreate}
          isDisabled={disabled}
          isLoading={isLoading}
          isClearable
          isSearchable
        />
      ) : (
        <Select
          isLoading={isLoading}
          menuPlacement="auto"
          maxMenuHeight={120}
          placeholder={placeholder}
          className="h-10 text-sm"
          styles={{
            container: (base) => ({
              ...base,
              borderColor: "#e2e8f0",
              ":hover": {
                borderColor: "#e2e8f0",
              },
            }),
          }}
          value={formattedValue}
          onChange={onSelect}
          options={options}
          isDisabled={disabled}
          isClearable
          isSearchable
        />
      )}
    </>
  )
}
