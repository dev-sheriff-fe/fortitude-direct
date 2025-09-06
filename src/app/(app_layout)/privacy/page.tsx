import { Metadata } from "next";
import { Suspense } from "react";
import PrivacyPolicy from "./pageContent";

export const metadata: Metadata = {
  title: "Privacy Policy | Fortitude Direct",
  description: "Privacy Policy for Fortitude Direct ecommerce app and website",
};

const PrivacyPolicyPage = ()=>{
  return <Suspense>
    <PrivacyPolicy/>
  </Suspense>
}

export default PrivacyPolicyPage