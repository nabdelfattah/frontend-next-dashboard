import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import React from "react";
import H1 from "@/foundation/shared/components/h1";
import Breadcrumb from "@/foundation/shared/components/breadcrumb";
import PageHeading from "@/foundation/shared/components/page-heading";
import Button from "@/foundation/shared/components/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default function Ecommerce() {
  const items = [{label: 'home', path: "/",}, {label: 'users', path: '/users'}, {label: 'users'}]
 
  function addNew(){
    console.log('add new item...')
  }
  
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <H1>Page title</H1>
        <Breadcrumb items={items}/>
        <Breadcrumb items={items} maxItems={2}/>

        <PageHeading breadCrumbItems={items}>helloWorld</PageHeading>
        <PageHeading add={addNew} >helloWorld</PageHeading>
        <Button loading={true}>hi</Button>
        <Button variant={'outline'} type="submit">submit</Button>
      </div>
    </div>
  );
}
