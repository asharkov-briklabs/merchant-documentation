import type { MDXComponents } from 'mdx/types';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { Callout } from 'fumadocs-ui/components/callout';
import * as TabsComponents from 'fumadocs-ui/components/tabs';
import { Accordion as AccordionItem, Accordions as Accordion } from 'fumadocs-ui/components/accordion';
import defaultComponents from 'fumadocs-ui/mdx';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultComponents,
    Card,
    Cards,
    Callout,
    ...TabsComponents,
    Accordion,
    AccordionItem,
    ...components,
  };
}
