// @ts-nocheck
import * as __fd_glob_34 from "../content/merchant/payments/webhooks.mdx?collection=merchant"
import * as __fd_glob_33 from "../content/merchant/payments/refunds.mdx?collection=merchant"
import * as __fd_glob_32 from "../content/merchant/payments/payment-methods.mdx?collection=merchant"
import * as __fd_glob_31 from "../content/merchant/payments/index.mdx?collection=merchant"
import * as __fd_glob_30 from "../content/merchant/payments/create-payment.mdx?collection=merchant"
import * as __fd_glob_29 from "../content/merchant/analytics/reports.mdx?collection=merchant"
import * as __fd_glob_28 from "../content/merchant/analytics/index.mdx?collection=merchant"
import * as __fd_glob_27 from "../content/merchant/analytics/exports.mdx?collection=merchant"
import * as __fd_glob_26 from "../content/merchant/analytics/dashboard.mdx?collection=merchant"
import * as __fd_glob_25 from "../content/merchant/integrations/index.mdx?collection=merchant"
import * as __fd_glob_24 from "../content/merchant/integrations/ecommerce.mdx?collection=merchant"
import * as __fd_glob_23 from "../content/merchant/integrations/crm.mdx?collection=merchant"
import * as __fd_glob_22 from "../content/merchant/integrations/accounting.mdx?collection=merchant"
import * as __fd_glob_21 from "../content/merchant/get-started/quick-start.mdx?collection=merchant"
import * as __fd_glob_20 from "../content/merchant/get-started/index.mdx?collection=merchant"
import * as __fd_glob_19 from "../content/merchant/get-started/environments.mdx?collection=merchant"
import * as __fd_glob_18 from "../content/merchant/get-started/authentication.mdx?collection=merchant"
import * as __fd_glob_17 from "../content/merchant/billing/subscriptions.mdx?collection=merchant"
import * as __fd_glob_16 from "../content/merchant/billing/pricing.mdx?collection=merchant"
import * as __fd_glob_15 from "../content/merchant/billing/invoices.mdx?collection=merchant"
import * as __fd_glob_14 from "../content/merchant/billing/index.mdx?collection=merchant"
import * as __fd_glob_13 from "../content/merchant/index.mdx?collection=merchant"
import * as __fd_glob_12 from "../content/banks/get-started/sandbox.mdx?collection=banks"
import * as __fd_glob_11 from "../content/banks/get-started/onboarding.mdx?collection=banks"
import * as __fd_glob_10 from "../content/banks/get-started/index.mdx?collection=banks"
import * as __fd_glob_9 from "../content/banks/get-started/api-credentials.mdx?collection=banks"
import * as __fd_glob_8 from "../content/banks/reporting/transaction-reports.mdx?collection=banks"
import * as __fd_glob_7 from "../content/banks/reporting/settlement-reports.mdx?collection=banks"
import * as __fd_glob_6 from "../content/banks/reporting/reconciliation.mdx?collection=banks"
import * as __fd_glob_5 from "../content/banks/reporting/index.mdx?collection=banks"
import * as __fd_glob_4 from "../content/banks/integration/webhooks.mdx?collection=banks"
import * as __fd_glob_3 from "../content/banks/integration/settlement.mdx?collection=banks"
import * as __fd_glob_2 from "../content/banks/integration/index.mdx?collection=banks"
import * as __fd_glob_1 from "../content/banks/integration/authorization.mdx?collection=banks"
import * as __fd_glob_0 from "../content/banks/index.mdx?collection=banks"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const banks = await create.doc("banks", "content/banks", {"index.mdx": __fd_glob_0, "integration/authorization.mdx": __fd_glob_1, "integration/index.mdx": __fd_glob_2, "integration/settlement.mdx": __fd_glob_3, "integration/webhooks.mdx": __fd_glob_4, "reporting/index.mdx": __fd_glob_5, "reporting/reconciliation.mdx": __fd_glob_6, "reporting/settlement-reports.mdx": __fd_glob_7, "reporting/transaction-reports.mdx": __fd_glob_8, "get-started/api-credentials.mdx": __fd_glob_9, "get-started/index.mdx": __fd_glob_10, "get-started/onboarding.mdx": __fd_glob_11, "get-started/sandbox.mdx": __fd_glob_12, });

export const merchant = await create.doc("merchant", "content/merchant", {"index.mdx": __fd_glob_13, "billing/index.mdx": __fd_glob_14, "billing/invoices.mdx": __fd_glob_15, "billing/pricing.mdx": __fd_glob_16, "billing/subscriptions.mdx": __fd_glob_17, "get-started/authentication.mdx": __fd_glob_18, "get-started/environments.mdx": __fd_glob_19, "get-started/index.mdx": __fd_glob_20, "get-started/quick-start.mdx": __fd_glob_21, "integrations/accounting.mdx": __fd_glob_22, "integrations/crm.mdx": __fd_glob_23, "integrations/ecommerce.mdx": __fd_glob_24, "integrations/index.mdx": __fd_glob_25, "analytics/dashboard.mdx": __fd_glob_26, "analytics/exports.mdx": __fd_glob_27, "analytics/index.mdx": __fd_glob_28, "analytics/reports.mdx": __fd_glob_29, "payments/create-payment.mdx": __fd_glob_30, "payments/index.mdx": __fd_glob_31, "payments/payment-methods.mdx": __fd_glob_32, "payments/refunds.mdx": __fd_glob_33, "payments/webhooks.mdx": __fd_glob_34, });