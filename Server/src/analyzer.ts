import * as request from "request";
import * as cheerio from "cheerio";
import { CacheManager } from "./cache";

export class Analyzer {
  cacheManager: CacheManager;
  constructor() {
    this.cacheManager = new CacheManager();
  }

  public async analyzeSite(siteName: string): Promise<Object> {
    try {
      const cachedResult = await this.cacheManager.getResult(siteName);
      if (cachedResult) {
        console.log("***from cache:" + siteName);
        return cachedResult;
      }

      const html = await this.makeRequestToSite(siteName);
      const $ = cheerio.load(html);
      const pageTitle = this.documentTitleAnalyzer($);
      const docType = this.documentVersionAnalyzer($);
      const headlings = this.documentHeadlingsAnalyzer($);
      const links = await this.linkAnalyzer($, siteName);
      const hasLoginForm = this.loginFormAnalyzer($);
      const result = {
        pageTitle,
        docType,
        headlings,
        links,
        hasLoginForm
      };
      this.cacheManager.setResult(siteName, result);
      console.log("***saved to cache:" + siteName);
      return result;
    } catch (error) {
      throw error;
    }
  }

  private async makeRequestToSite(uri: string): Promise<string> {
    return new Promise((resolve, reject) => {
      request(uri, (error, response, html) => {
        if (!error && response.statusCode == 200) {
          resolve(html);
        } else {
          reject(error);
        }
      });
    });
  }

  private getDocumentVersions(): Map<string, string> {
    const docVersions2Definitions = new Map<string, string>();
    docVersions2Definitions.set("HTML5", "<!DOCTYPE HTML>");
    docVersions2Definitions.set(
      "HTML 4.01 Strict",
      '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">'
    );
    docVersions2Definitions.set(
      "HTML 4.01 Transitional",
      '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">'
    );
    docVersions2Definitions.set(
      "HTML 4.01 Frameset",
      '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">'
    );
    docVersions2Definitions.set(
      "XHTML 1.0 Strict",
      '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">'
    );
    docVersions2Definitions.set(
      "XHTML 1.0 Transitional",
      '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'
    );
    docVersions2Definitions.set(
      "XHTML 1.0 Frameset",
      '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">'
    );
    docVersions2Definitions.set(
      "XHTML 1.1 - DTD",
      '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">'
    );
    docVersions2Definitions.set(
      "XHTML Basic 1.1",
      '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd">'
    );

    return docVersions2Definitions;
  }

  private documentTitleAnalyzer($: CheerioStatic): string {
    return $("title").text();
  }

  private documentVersionAnalyzer($: CheerioStatic): string {
    const docVersions2Definitions = this.getDocumentVersions();
    const document = $.html().substr(0, 250);
    let version = "UNKNOWN DOCUMENT VERSION";
    docVersions2Definitions.forEach((value: string, key: string) => {
      if (document.toLowerCase().startsWith(value.toLowerCase())) {
        version = key;
      }
    });
    return version;
  }

  private documentHeadlingsAnalyzer($: CheerioStatic): object {
    const headlingSet = new Set<string>(["h1", "h2", "h3", "h4", "h5", "h6"]);
    const headlingResults = {};
    headlingSet.forEach(element => {
      headlingResults[element] = $(element).length;
    });
    return headlingResults;
  }

  private async linkAnalyzer(
    $: CheerioStatic,
    siteName: string
  ): Promise<object> {
    const links = $("a");
    const results = {
      internalLinks: 0,
      externalLinks: 0,
      inaccesibleInternalLinks: 0,
      inaccesibleExternalLinks: 0
    };

    links.toArray().forEach(async link => {
      const href = link.attribs["href"];
      if (!href) {
        return;
      }
      let isInternalLink = false;
      let linkUri = "";
      if (
        (href.startsWith("http://") || href.startsWith("https://")) &&
        !href.startsWith(siteName)
      ) {
        results.externalLinks++;
        linkUri = href;
      } else {
        results.internalLinks++;
        isInternalLink = true;
        if (href.startsWith(siteName)) {
          linkUri = href;
        } else {
          linkUri = siteName + href;
        }
      }

      try {
        await this.makeRequestToSite(linkUri);
      } catch (error) {
        if (isInternalLink) {
          results.inaccesibleInternalLinks++;
        } else {
          results.inaccesibleExternalLinks++;
        }
      }
    });
    return results;
  }

  private loginFormAnalyzer($: CheerioStatic): boolean {
    let isLoginFormDetected = false;
    $("form").each(function(i, el) {
      const buttonText = $(el)
        .find('[type="submit"]')
        .text();
      if (
        buttonText &&
        (buttonText.toLocaleLowerCase().includes("login") ||
          buttonText.toLocaleLowerCase().includes("signin"))
      ) {
        isLoginFormDetected = true;
      }
    });
    return isLoginFormDetected;
  }
}
