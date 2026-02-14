// @ts-nocheck
import * as __fd_glob_22 from "../content/merchant/troubleshooting/payment-errors.mdx?collection=merchant"
import * as __fd_glob_21 from "../content/merchant/troubleshooting/integration-issues.mdx?collection=merchant"
import * as __fd_glob_20 from "../content/merchant/troubleshooting/index.mdx?collection=merchant"
import * as __fd_glob_19 from "../content/merchant/troubleshooting/account-issues.mdx?collection=merchant"
import * as __fd_glob_18 from "../content/merchant/guides/index.mdx?collection=merchant"
import * as __fd_glob_17 from "../content/merchant/guides/going-live.mdx?collection=merchant"
import * as __fd_glob_16 from "../content/merchant/guides/getting-started.mdx?collection=merchant"
import * as __fd_glob_15 from "../content/merchant/guides/accept-first-payment.mdx?collection=merchant"
import * as __fd_glob_14 from "../content/merchant/faq/payments.mdx?collection=merchant"
import * as __fd_glob_13 from "../content/merchant/faq/index.mdx?collection=merchant"
import * as __fd_glob_12 from "../content/merchant/faq/billing.mdx?collection=merchant"
import * as __fd_glob_11 from "../content/merchant/faq/account.mdx?collection=merchant"
import * as __fd_glob_10 from "../content/banks/faq/settlement.mdx?collection=banks"
import * as __fd_glob_9 from "../content/banks/faq/partnership.mdx?collection=banks"
import * as __fd_glob_8 from "../content/banks/faq/integration.mdx?collection=banks"
import * as __fd_glob_7 from "../content/banks/faq/index.mdx?collection=banks"
import * as __fd_glob_6 from "../content/banks/troubleshooting/webhook-problems.mdx?collection=banks"
import * as __fd_glob_5 from "../content/banks/troubleshooting/settlement-issues.mdx?collection=banks"
import * as __fd_glob_4 from "../content/banks/troubleshooting/index.mdx?collection=banks"
import * as __fd_glob_3 from "../content/banks/troubleshooting/api-errors.mdx?collection=banks"
import * as __fd_glob_2 from "../content/banks/guides/integration-guide.mdx?collection=banks"
import * as __fd_glob_1 from "../content/banks/guides/index.mdx?collection=banks"
import * as __fd_glob_0 from "../content/banks/guides/go-live-checklist.mdx?collection=banks"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const banks = await create.doc("banks", "content/banks", {"guides/go-live-checklist.mdx": __fd_glob_0, "guides/index.mdx": __fd_glob_1, "guides/integration-guide.mdx": __fd_glob_2, "troubleshooting/api-errors.mdx": __fd_glob_3, "troubleshooting/index.mdx": __fd_glob_4, "troubleshooting/settlement-issues.mdx": __fd_glob_5, "troubleshooting/webhook-problems.mdx": __fd_glob_6, "faq/index.mdx": __fd_glob_7, "faq/integration.mdx": __fd_glob_8, "faq/partnership.mdx": __fd_glob_9, "faq/settlement.mdx": __fd_glob_10, });

export const merchant = await create.doc("merchant", "content/merchant", {"faq/account.mdx": __fd_glob_11, "faq/billing.mdx": __fd_glob_12, "faq/index.mdx": __fd_glob_13, "faq/payments.mdx": __fd_glob_14, "guides/accept-first-payment.mdx": __fd_glob_15, "guides/getting-started.mdx": __fd_glob_16, "guides/going-live.mdx": __fd_glob_17, "guides/index.mdx": __fd_glob_18, "troubleshooting/account-issues.mdx": __fd_glob_19, "troubleshooting/index.mdx": __fd_glob_20, "troubleshooting/integration-issues.mdx": __fd_glob_21, "troubleshooting/payment-errors.mdx": __fd_glob_22, });