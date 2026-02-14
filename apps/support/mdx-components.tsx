import type { MDXComponents } from 'mdx/types';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { Callout } from 'fumadocs-ui/components/callout';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import defaultComponents from 'fumadocs-ui/mdx';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultComponents,
    Card,
    Cards,
    Callout,
    Tab,
    Tabs,
    ...components,
  };
}
