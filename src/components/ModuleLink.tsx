import React from 'react';
import Link from '@docusaurus/Link';
import {usePluginData} from '@docusaurus/useGlobalData';

interface ModuleEntry {
  title: string;
  path: string;
  parent?: string;
  part: string;
  position: number;
}

interface RegistryData {
  modules: Record<string, ModuleEntry>;
  parts: Array<{
    dirName: string;
    label: string;
    position: number;
    description: string;
  }>;
}

interface ModuleLinkProps {
  slug: string;
  text?: string;
}

export default function ModuleLink({slug, text}: ModuleLinkProps): React.ReactElement {
  const {modules} = usePluginData('module-registry') as RegistryData;
  const entry = modules[slug];

  if (!entry) {
    throw new Error(
      `[ModuleLink] Unknown module slug "${slug}". ` +
      `Available slugs: ${Object.keys(modules).sort().join(', ')}`
    );
  }

  return (
    <Link to={entry.path}>
      {text ?? entry.title}
    </Link>
  );
}
