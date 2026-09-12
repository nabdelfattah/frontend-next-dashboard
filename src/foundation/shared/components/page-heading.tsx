import { ReactNode } from 'react'
import H1 from './h1';
import Breadcrumb from './breadcrumb';
import { BreadcrumbEntry, TableData } from '../types/props';
import PageActions from './page-actions';

/**
 * Reusable page heading component combining the page title with an optional breadcrumb trail and page actions.
 *
 * @param children - Page title, rendered inside `H1`.
 * @param breadCrumbItems - Items passed to `Breadcrumb`. When omitted, no breadcrumb is rendered.
 * @param breadCrumbMaxItems - `maxItems` passed to `Breadcrumb`.
 * @param add - Handler passed to `PageActions`. When neither this nor `tableToExport` is provided, no page actions are rendered.
 * @param tableToExport - Table export data passed to `PageActions`.
 *
 * @example
 * <PageHeading breadCrumbItems={[{ label: "Home", path: "/" }, { label: "Users" }]} add={() => {}}>
 *   Users
 * </PageHeading>
 */
export default function PageHeading({
  breadCrumbItems,
  breadCrumbMaxItems,
  add,
  tableToExport,
  children,
}: {
  breadCrumbItems?: BreadcrumbEntry[];
  breadCrumbMaxItems?: number;
  add?: () => void;
  tableToExport?: TableData;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <H1>{children}</H1>

      <div className="flex items-center gap-4">
        {breadCrumbItems && (
          <Breadcrumb items={breadCrumbItems} maxItems={breadCrumbMaxItems} />
        )}
        {(add || tableToExport) && (
          <PageActions add={add} tableToExport={tableToExport} />
        )}
      </div>
    </div>
  )
}
