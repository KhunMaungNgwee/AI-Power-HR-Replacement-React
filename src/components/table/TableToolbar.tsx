import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Input } from "../ui/input";
import { SetStateAction, useEffect, useMemo, useRef } from "react";
import { ColumnFiltersState } from "@tanstack/react-table";
import debounce from "lodash/debounce";
import { useTranslation } from "react-i18next";

const FILTER_OPTIONS = [
  { label: "fields.oldest", value: "Oldest" },
  { label: "fields.newest", value: "Newest" },
];

type TableToolbarProps = {
  header?: string;
  headerDescription?: string;
  search: boolean;
  sort: boolean;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  globalFilter: string | number;
  selectedOpt: "Newest" | "Oldest";
  filterColumns: string[];
  extraQuery: { column: string; value: string }[] | [];
  setColumnFilters: React.Dispatch<SetStateAction<ColumnFiltersState>>;
  classNames: string;
  sortSelectNewLine?: boolean;
  setSelectedOpt: (value: "Oldest" | "Newest") => void;

  setSearching: React.Dispatch<SetStateAction<boolean>>;
  selectOptions?: { label: string; value: string }[];
  children: React.ReactNode;
};

const TableToolbar = ({
  search,
  setSearching,
  sort,
  header,
  headerDescription,
  selectedOpt,
  setSelectedOpt,
  setGlobalFilter,
  filterColumns,
  extraQuery,
  setColumnFilters,
  globalFilter,
  sortSelectNewLine = false,
  selectOptions = FILTER_OPTIONS,
  classNames = "",
  children,
}: TableToolbarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  useEffect(() => {
    const filterState: ColumnFiltersState = [
      ...filterColumns.map((col) => ({ id: col, value: globalFilter })),
      ...extraQuery.map(({ column, value }) => ({ id: column, value })),
    ];

    setColumnFilters((prev) => {
      if (JSON.stringify(prev) !== JSON.stringify(filterState)) {
        return filterState;
      }
      return prev;
    });
  }, [globalFilter, extraQuery, filterColumns]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setGlobalFilter("");
  }, [filterColumns.toString()]);

  // Debounced function to update global filter
  const debouncedSetGlobalFilter = useMemo(
    () =>
      debounce((value: string) => {
        setGlobalFilter(value);
        setSearching(false);
      }, 600),
    [setGlobalFilter]
  );

  const handleChange = () => {
    const value = inputRef.current?.value || "";
    setSearching(true); // Show searching state
    debouncedSetGlobalFilter(value); // Debounced global filter update
  };

  const handleSelect = (value: "Oldest" | "Newest") => {
    setSelectedOpt(value);
  };

  return (
    <div>
      <div
        className={cn(
          "flex pb-2",
          sortSelectNewLine ? "2xl:flex-nowrap flex-wrap mt-2 xl:mt-0" : ""
        )}
      >
        <div className="mb-4">
          <h1 className="text-nowrap mb-2 text-xl font-bold">{header ?? ""}</h1>
          {headerDescription ? (
            <p className="text-sm text-nowrap text-gray-400">
              {headerDescription}
            </p>
          ) : (
            <></>
          )}
        </div>

        <div
          className={cn(
            !classNames ? "flex justify-end w-full gap-2" : classNames
          )}
        >
          {children}
          {search && (
            <div className="h-fit relative">
              <Input
                type="text"
                placeholder={t("placeholder.search")}
                className="indent-3 w-fit bg-gray-100"
                ref={inputRef}
                onChange={handleChange}
              />
              <MagnifyingGlassIcon className="top-1/2 bottom-1/2 left-2 absolute -translate-y-1/2" />
            </div>
          )}
          {sort && !sortSelectNewLine && (
            <Select defaultValue="Newest" onValueChange={handleSelect}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={`Sort By: ${selectedOpt}`} />
              </SelectTrigger>
              <SelectContent>
                {selectOptions.map((opt, index) => (
                  <SelectItem value={opt.value} key={index}>
                    {t("fields.sort-by")}:
                    <span className="font-bold"> {t(opt.label)}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      {sort && sortSelectNewLine && (
        <div className="flex justify-end mt-2">
          <Select defaultValue="Newest" onValueChange={handleSelect}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={`Sort By: ${selectedOpt}`} />
            </SelectTrigger>
            <SelectContent>
              {selectOptions.map((opt, index) => (
                <SelectItem value={opt.value} key={index}>
                  Sort By:
                  <span className="font-bold"> {opt.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default TableToolbar;
