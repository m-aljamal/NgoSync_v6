// "use client"

// import { useMemo } from "react"
// import Select, { type SingleValue } from "react-select"
// import CreateableSelect from "react-select/creatable"

// type Props = {
//   onChange: (value?: string | null) => void
//   onCreate?: (value: string) => void
//   options?: { value: string; label: string }[]
//   value?: string | null | undefined
//   disabled?: boolean
//   placeholder?: string
//   creatable?: boolean
//   isLoading?: boolean
// }

// export const AppSelect = ({
//   onChange,
//   onCreate,
//   options = [],
//   value,
//   disabled,
//   placeholder,
//   creatable = false,
//   isLoading,
// }: Props) => {
//   const onSelect = (
//     option: SingleValue<{ value: string; label: string }> | null
//   ) => {
//     onChange(option ? option.value : null)
//   }
//   const formattedValue = useMemo(() => {
//     return options.find((option) => option.value === value) || null
//   }, [value, options])
//   return (
//     <>
//       {creatable ? (
//         <CreateableSelect
//           menuPlacement="auto"
//           maxMenuHeight={150}
//           placeholder={placeholder}
//           className="h-10 text-sm"
//           styles={{
//             container: (base) => ({
//               ...base,
//               borderColor: "#e2e8f0",
//               ":hover": {
//                 borderColor: "#e2e8f0",
//               },
//             }),
//           }}
//           value={formattedValue}
//           onChange={onSelect}
//           options={options}
//           onCreateOption={onCreate}
//           isDisabled={disabled}
//           isLoading={isLoading}
//           isClearable
//           isSearchable
//         />
//       ) : (
//         <Select
//           isLoading={isLoading}
//           menuPlacement="auto"
//           maxMenuHeight={120}
//           placeholder={placeholder}
//           className="h-10 text-sm"
//           styles={{
//             container: (base) => ({
//               ...base,
//               borderColor: "#e2e8f0",
//               ":hover": {
//                 borderColor: "#e2e8f0",
//               },
//             }),
//           }}
//           value={formattedValue}
//           onChange={onSelect}
//           options={options}
//           isDisabled={disabled}
//           isClearable
//           isSearchable
//         />
//       )}
//     </>
//   )
// }

"use client"

import { useMemo } from "react"
import Select, { MultiValue, SingleValue } from "react-select"
import CreateableSelect from "react-select/creatable"

type Option = { value: string; label: string }

type Props = {
  onChange: (value?: string | string[] | null) => void
  onCreate?: (value: string) => void
  options?: Option[]
  value?: string | string[] | null | undefined
  disabled?: boolean
  placeholder?: string
  creatable?: boolean
  isLoading?: boolean
  isMulti?: boolean
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
  isMulti = false,
}: Props) => {
  const onSelect = (
    option: SingleValue<Option> | MultiValue<Option> | null
  ) => {
    if (isMulti) {
      const selectedValues = (option as MultiValue<Option>).map(
        (item) => item.value
      )
      onChange(selectedValues.length > 0 ? selectedValues : null)
    } else {
      onChange((option as SingleValue<Option>)?.value || null)
    }
  }

  const formattedValue = useMemo(() => {
    if (isMulti && Array.isArray(value)) {
      return value.map(
        (v) =>
          options.find((option) => option.value === v) || { value: v, label: v }
      )
    }
    return options.find((option) => option.value === value) || null
  }, [value, options, isMulti])

  const SelectComponent = creatable ? CreateableSelect : Select

  return (
    <SelectComponent
      isMulti={isMulti}
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
          zIndex: "50"
        }),
      }}
      value={formattedValue}
      onChange={onSelect}
      options={options}
      onCreateOption={onCreate}
      isDisabled={disabled}
      isClearable
      isSearchable
    />
  )
}
