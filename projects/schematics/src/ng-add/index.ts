import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { Schema as SchematicsOptions } from './schema';

export function addSchematics(_options: SchematicsOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('Schematics are running...');

    tree.create('new-file.ts', `console.log('👋 from schematics')`);

    return tree;
  };
}
