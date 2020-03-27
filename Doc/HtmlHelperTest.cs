
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Text.RegularExpressions;
using WW.Potato.Common.Util;

namespace WW.Potato.Test
{
    [TestClass]
    public class HtmlHelperTest
    {
        [TestMethod]
        public void StripHTMLTest()
        {
            string html = "<p>the p content</p><P class=\"\">the second &nbsp;&nbsp;&nbsp;&nbsp; content</P>";
            string text = HtmlHelper.StripHTML(html);
            Assert.IsNotNull(text);
        }

        [TestMethod]
        public void FilterHTMLTest()
        {
            string[] attributes = new string[] { "style" };
            string[] tags = new string[] { "span", "script", "style" };
            string html =
                "<p style=\"font: 12px;\">the p content</p>"
                + "<P class=\"\" style='font: 12px;'>the nt</P>"
                + "<p style = \"font: 12px;\">the p content</p>"
                + "<p style = \"font: 12px;\" >the p content</p>"
                + "<span id=\"sid\" style=\"font: 12px;\" />"
                + "<span id=\"sid\" style=\"font: 12px;\" >the span content</span>"
                + "<span id=\"sid\" style=\"font: 12px;\" ><p style=\"font: 12px;\">the p content</p></span>"
                + "<script type=\"text/javascript\" >alert(\"hello\");</script>"
                + "<script>alert(\"hello\");</script>"
                + "<script />"
                + "<style>.vip-crown-index-menu{position:relative;}</style>"
                + "<a href=\"abc.com\">anchor</a>"
                + "<a href=\"abc.com\" />"
                + "<a href=\"qa.htq.com\" />"
                + "<a href=\"qa.htq.com\">hello</a>"
                + "";
            string text = HtmlHelper.StripHTML(html, attributes, tags);
            Assert.IsNotNull(text);
        }

        [TestMethod]
        public void IsExternalLinkExistsTest()
        {
            string[] allowDomains = new string[] { "htq.com", "qa.htq.com" };
            string html =
                "<p style=\"font: 12px;\">the p content</p>"
                + "<P class=\"\" style='font: 12px;'>the nt</P>"
                + "<p style = \"font: 12px;\">the p content</p>"
                + "<p style = \"font: 12px;\"  >the p content</p>"
                + "<span id=\"sid\" style=\"font: 12px;\" />"
                + "<span id=\"sid\" style=\"font: 12px;\" >the span content</span>"
                + "<span id=\"sid\" style=\"font: 12px;\" ><p style=\"font: 12px;\">the p content</p></span>"
                + "<script type=\"text/javascript\" >alert(\"hello\");</script>"
                + "<style>.vip-crown-index-menu{position:relative;}</style>"
                + "<a href=\"abc.com\">anchor</a>"
                + "<a href=\"abc.com\" />"
                + "<a href=\"qa.htq.com\" />"
                + "<a href=\"qa.htq.com\">hello</a>"
                + "";
            bool b = HtmlHelper.IsExternalLinkExists(html, allowDomains);
            Assert.IsTrue(b);
        }
    }
}
