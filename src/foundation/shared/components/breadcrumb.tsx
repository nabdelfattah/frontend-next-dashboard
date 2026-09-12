import { Fragment } from "react";
import Link from "next/link";
import {
  Breadcrumb as ShadBreadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@shared/components/ui/breadcrumb";
import { BreadcrumbEntry } from "../types/props";



/**
 * Reusable breadcrumb navigation component.
 *
 * @param items - Ordered list of breadcrumb entries. An entry with a `path` renders as a link to that path; an entry without one renders as plain text.
 * @param maxItems - Number of items to show before the middle ones collapse behind an ellipsis. Defaults to 4.
 *
 * @example
 * <Breadcrumb
 *   items={[
 *     { label: "Home", path: "/" },
 *     { label: "Components", path: "/docs/components" },
 *     { label: "Breadcrumb" },
 *   ]}
 * />
 */
export default function Breadcrumb({
  items,
  maxItems = 4,
}: {
  items: BreadcrumbEntry[];
  maxItems?: number;
}) {
  const isCollapsed = items.length > maxItems;
  const visibleItems = isCollapsed
    ? [items[0], ...items.slice(items.length - (maxItems - 1))]
    : items;

  return (
    <ShadBreadcrumb>
      <BreadcrumbList className="gap-1.5">
        {visibleItems.map((item, index) => {
          const isLast = index === visibleItems.length - 1;
          const showEllipsisBefore = isCollapsed && index === 1;

          return (
            <Fragment key={`${item.label}-${index}`}>
              {showEllipsisBefore && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbEllipsis className="text-gray-500 dark:text-gray-400" />
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-gray-400 dark:text-gray-400 [&>svg]:size-4" />
                </>
              )}

              <BreadcrumbItem>
                {item.path ? (
                  <BreadcrumbLink
                    asChild
                    className="text-gray-500 dark:text-gray-400"
                  >
                    <Link href={item.path}>{item.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="text-gray-800 dark:text-white/90">
                    {item.label}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>

              {!isLast && (
                <BreadcrumbSeparator className="text-gray-400 dark:text-gray-400 [&>svg]:size-4" />
              )}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </ShadBreadcrumb>
  );
}
