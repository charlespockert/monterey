import {FS} from 'monterey-pal';

export class JSPMDetection {
  async findJspmConfig(project) {
    let packageJSON = JSON.parse(await FS.readFile(project.packageJSONPath));
    let isUsingJSPM = false;
    let configJs = null;

    if (packageJSON.jspm) {

      await this.findJspmVersion(project, packageJSON);

      let jspm016Path = this.getJspm016Path(project, packageJSON);
      let jspm017Path = this.getJspm017Path(project, packageJSON);

      // we were unable to find JSPM in the devDependencies section of package.json
      // so we're just going to look for a config.js or a jspm.config.js
      // in order to try and determine what JSPM version is being used
      if (!project.jspmVersion) {
        if (await FS.fileExists(jspm016Path)) {
          project.configJsPath = jspm016Path;
          project.jspmVersion = '^0.16.0';
          project.jspmDefinition = '^0.16.0';
        } else if (await FS.fileExists(jspm017Path)) {
          project.configJsPath = jspm016Path;
          project.jspmVersion = '^0.17.0';
          project.jspmDefinition = '^0.17.0';
        }
      } else {
        let major = parseInt(project.jspmVersion.split('.')[0], 10);
        let minor = parseInt(project.jspmVersion.split('.')[1], 10);
        if (major === 0) {
          if (minor < 17) {
            project.configJsPath = jspm016Path;
          } else {
            project.configJsPath = jspm017Path;
          }
        }
      }

      if (project.configJsPath && project.jspmVersion) {
        isUsingJSPM = true;
      }
    }

    project.isUsingJSPM = isUsingJSPM;
  }

  getJspm016Path(project, packageJSON) {
    let baseURL = '.';
    if (packageJSON.jspm.directories && packageJSON.jspm.directories.baseURL) {
      baseURL = packageJSON.jspm.directories.baseURL;
    }
    return FS.join(project.path, baseURL, 'config.js');
  }

  getJspm017Path(project, packageJSON) {
    // TODO: implement reading JSPM 0.17.x configuration
    let baseURL = '';
    if (packageJSON.jspm.directories && packageJSON.jspm.directories.baseURL) {
      baseURL = packageJSON.jspm.directories.baseURL;
    }
    return FS.join(project.path, baseURL, 'jspm.config.js');
  }

  async findJspmVersion(project, packageJSON) {
    let jspmDefinition = (packageJSON.dependencies && packageJSON.dependencies.jspm) || (packageJSON.devDependencies && packageJSON.devDependencies.jspm);
    let jspmVersion = null;
    if (jspmDefinition) {
      jspmVersion = jspmDefinition;
      if (jspmVersion[0] === '^' || jspmVersion[0] === '~') {
        // TODO: find version actually used
        jspmVersion = jspmVersion.substring(1);
      }
      project.jspmDefinition = jspmDefinition;
      project.jspmVersion = jspmVersion;
    }
  }
}