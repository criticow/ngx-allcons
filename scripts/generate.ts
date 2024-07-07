import * as fs from 'fs';
import * as path from 'path';

const sources = [
  {
    name: 'bootstrap-icons',
    path: 'node_modules/bootstrap-icons/icons',
    prefix: 'bi'
  }
];

const getClassName = (svgName: string) => {
  return svgName.split('-').map((part) => part.charAt(0).toUpperCase() + part.substring(1)).join("");
}

const generateComponents = () => {
  const root = path.join(__dirname, '../projects/ngx-allcons/src');

  try{
    // Clears the lib folder that contains all the components
    fs.rmSync(path.join(root, 'lib'), { recursive: true, force: true });
    // Clears the public-api.ts file
    fs.writeFileSync(path.join(root, 'public-api.ts'), '// THIS FILE IS BEING GENERATED AUTOMATICALLY, YOUR CHANGES WILL NOT BE KEPT\n\n');

    const cmpTemplate = fs.readFileSync(path.join(root, 'base-component.ts'), {encoding: 'utf-8'});

    sources.forEach((source) => {
      const sourcePath = path.join(__dirname, '../', source.path);

      if(!fs.existsSync(sourcePath)){
        throw Error(`Source folder ${source.path} does not exists, make sure npm packages are installed!`);
      }

      // Creates a folder inside the lib folder with the entry name
      fs.mkdirSync(path.join(root, 'lib', source.name), {recursive: true});

      // Reads the folder that contains the svgs
      const svgs = fs.readdirSync(sourcePath, { withFileTypes: true });

      svgs.forEach((svg) => {
        const svgName = svg.name.replace('.svg', '');
        // Individual path for the component
        const cmpPath = path.join(root, 'lib', source.name, svgName);
        // Create the component folder
        fs.mkdirSync(cmpPath, {recursive: true});
        // svg content
        const svgContent = fs.readFileSync(path.join(sourcePath, svg.name), { encoding: 'utf-8' });
        // Component content
        const cmpContent = cmpTemplate
            .replace('$className', getClassName(source.prefix + '-' + svgName))
            .replace('$selector', source.prefix + '-' + svgName)
            .replace('$template', svgContent.split("\n").join("\n    "));
        // Creates the component.ts
        fs.writeFileSync(path.join(cmpPath, `${svgName}.component.ts`), cmpContent);
        // Appends the import statement into the public-api.ts
        fs.appendFileSync(path.join(root, 'public-api.ts'), `export * from './lib/${source.name}/${svgName}/${svgName}.component';\n`);
      });
    });
  } catch(error) {
    console.log(error);
  }
}

generateComponents();