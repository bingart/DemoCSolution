using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;

namespace WW.Potato.Common.Util
{
    public static class HtmlHelper
    {
        private static Regex HTML_TAG_REGEX =
            new Regex("<.*?>", RegexOptions.IgnoreCase | RegexOptions.Compiled);

        private static Regex HTML_BLACK_REGEX = null;

        private static Regex HTML_ANCHOR_REGEX =
            new Regex("((<)((\\s*?)a(\\s+?))(.*?)((href)(\\s*?)(=)(\\s*?)([\"|'])([A-Za-z0-9-_\\.]+)([\"|']))(.*?)((/*)(>)))", 
                RegexOptions.IgnoreCase | RegexOptions.Compiled);

        private static Regex ALLOW_DOMAIN_REGEX = null;

        private static Regex GetBlackRegex(IList<string> attributes, IList<string> tags)
        {
            string s = string.Empty;
            if (attributes != null)
            {
                foreach (var a in attributes)
                {
                    if (s.Length > 0)
                    {
                        s += "|";
                    }
                    s += string.Format("((\\s+?){0}(\\s*?)(=)(\\s*?)([\"|'])(.*?)([\"|']))", a);
                }
            }
            if (tags != null)
            {
                foreach (var t in tags)
                {
                    if (s.Length > 0)
                    {
                        s += "|";
                    }
                    s += string.Format("((<)(\\s*?){0}(\\s*?)([^>]*?)(/>))", t);
                    s += "|";
                    s += string.Format("((<)((\\s*?){0}(\\s*?))([^>]*?)(>)(.*?)(</)((\\s*?){0}(\\s*?))(>))", t);
                }
            }
            return new Regex(s, RegexOptions.IgnoreCase | RegexOptions.Compiled);
        }

        private static Regex GetAllowDomainRegex(IList<string> allowDomains)
        {
            string s = string.Empty;
            if (allowDomains != null)
            {
                foreach (var d in allowDomains)
                {
                    if (s.Length > 0)
                    {
                        s += "|";
                    }
                    string str = d.Replace(".", "\\.");
                    s += string.Format("({0})", str);
                }
            }
            return new Regex(s, RegexOptions.IgnoreCase | RegexOptions.Compiled);
        }

        /// <summary>
        /// strip all html tags from text.
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public static string StripHTML(string input)
        {
            return System.Web.HttpUtility.HtmlDecode(HTML_TAG_REGEX.Replace(input, " "));
        }

        /// <summary>
        /// Strip specific element attributes and html tags.
        /// </summary>
        /// <param name="input"></param>
        /// <param name="attributes"></param>
        /// <param name="tags"></param>
        /// <returns></returns>
        public static string StripHTML(string input, IList<string> attributes, IList<string> tags)
        {
            if (HTML_BLACK_REGEX == null)
            {
                HTML_BLACK_REGEX = GetBlackRegex(attributes, tags);
            }
            return HTML_BLACK_REGEX.Replace(input, string.Empty);
        }

        public static bool IsExternalLinkExists(string input, IList<string> allowDomains)
        {
            if (ALLOW_DOMAIN_REGEX == null)
            {
                ALLOW_DOMAIN_REGEX = GetAllowDomainRegex(allowDomains);
            }
            MatchCollection matches = HTML_ANCHOR_REGEX.Matches(input);
            foreach (var m in matches)
            {
                if (!ALLOW_DOMAIN_REGEX.IsMatch(m.ToString()))
                {
                    return true;
                }
            }
            return false;
        }
    }
}
