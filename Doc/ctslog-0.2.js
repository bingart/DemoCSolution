window.cts = window.cts ||
function(t) {
	"use strict";
	var r = window.document;
	return {
		get_env: function() {
			for (var t = r.getElementsByTagName("script"), e = 0, n = t.length; e < n; e++) if ( - 1 < t[e].src.indexOf("ctslog")) return t[e].getAttribute("data-environment");
			return ""
		},
		report: function(t) { (new Image).src = t
		},
		types: {
			error: {
			default:
				0,
				custom: 1,
				xhr: 2
			},
			perf: {
			default:
				10
			}
		}
	}
} (window),
window.cts.ce = window.cts.ce ||
function(t, e) {
	"use strict";
	var a = t.cts.types.error.
default,
	p = t.cts.types.error.xhr,
	n = t.cts.types.error.custom,
	r = t.cts.report;
	function i(t, e) {
		this.win = t,
		this.config = e,
		this.init()
	}
	i.prototype.init = function() {
		this.env = this.config.env,
		this.error(),
		this.xhr()
	},
	i.prototype.error = function() {
		var s = this;
		this.win.onerror = function(t, e, n, r, i) {
			var o = i ? i.stack: null;
			s.format([t, e, n, r, o], a),
			s.inject()
		}
	},
	i.prototype.xhr = function() {
		var o, s, a, c = this,
		n = e.prototype.open,
		t = e.prototype.send;
		e.prototype.open = function(t, e) {
			a = new Date,
			o = t,
			s = e,
			n.apply(this, arguments)
		},
		e.prototype.send = function() {
			var i = this;
			this.addEventListener("readystatechange",
			function(e) {
				if (4 == i.readyState) try {
					var n, t = e.target.status.toString(),
					r = new Date - a;
					if (!/^[45]/.test(t.slice(0, -2))) return;
					try {
						n = JSON.parse(e.target.response)
					} catch(t) {
						n = e.target.response.substring(0, 100)
					}
					c.format([o, t, n, s, r], p),
					c.inject()
				} catch(t) {}
			},
			!1),
			t.apply(this, arguments)
		}
	},
	i.prototype.event = function(t) {
		this.format(t, n),
		this.inject()
	},
	i.prototype.format = function(t, e) {
		switch (this.type = e, this.type) {
		case a:
			this.data = {
				message: t[0],
				source: t[1],
				line: t[2],
				column: t[3],
				stack: t[4]
			};
			break;
		case n:
			this.data = "object" != typeof t ? {
				_event: t
			}: t;
			break;
		case n:
			this.data = {
				method: t[0],
				status: t[1],
				response: t[2],
				url: t[3],
				response_time: t[4]
			}
		}
	},
	i.prototype.generate_url = function() {
		var t = "&t=" + this.type + "&cw=" + screen.width + "&ch=" + screen.height + "&e=" + encodeURIComponent(this.env);
		return this.data && (t += "&d=" + encodeURIComponent(JSON.stringify(this.data))),
		this.config.error_url + "?ts=" + (new Date).getTime() + t
	},
	i.prototype.inject = function() {
		this.should_report() && r(this.generate_url())
	},
	i.prototype.should_report = function() {
		return Math.random() < this.get_sampling()
	},
	i.prototype.get_sampling = function() {
		return this.send_sampling || this.config.sampling
	},
	i.prototype.change_sampling = function(t) {
		this.send_sampling = t
	};
	var o = new i(t, {
		env: t.cts.get_env(),
		error_url: "https://www.popular123.com/t.gif",
		sampling: parseFloat("0.5")
	});
	return {
		push: function(t, e) {
			if (t) try {
				o.event(t),
				e && e.call(null)
			} catch(t) {}
		},
		sampling: function(t) {
			o.change_sampling(t)
		}
	}
} (window, XMLHttpRequest),
window.cts.cp = window.cts.cp ||
function(t) {
	"use strict";
	var n = t.cts.types.perf.
default,
	e = t.cts.report;
	function r(t, e) {
		this.win = t,
		this.config = e,
		this.init()
	}
	function i(t) {
		return "iframe" == t.initiatorType && /\/adwidget\/index2\?/gi.test(t.name)
	}
	r.prototype.init = function() {
		var t = this;
		this.win.performance && (this.win.onload = function() {
			t.send()
		})
	},
	r.prototype.get_timing = function() {
		var t = this.win.performance.timing;
		return {
			ns: t.navigationStart,
			rs: t.redirectStart,
			re: t.redirectEnd,
			fs: t.fetchStart,
			dls: t.domainLookupStart,
			dle: t.domainLookupEnd,
			cs: t.connectStart,
			scs: t.secureConnectionStart,
			ce: t.connectEnd,
			reqs: t.requestStart,
			ress: t.responseStart,
			rese: t.responseEnd,
			ues: t.unloadEventStart,
			uee: t.unloadEventEnd,
			dl: t.domLoading,
			di: t.domInteractive,
			dcles: t.domContentLoadedEventStart,
			dclee: t.domContentLoadedEventEnd,
			dc: t.domComplete,
			les: t.loadEventStart,
			lee: t.loadEventEnd
		}
	},
	r.prototype.get_timing_index = function() {
		var t = this.win.performance.timing;
		return {
			dns: t.domainLookupEnd - t.domainLookupStart,
			tcp: t.connectEnd - t.connectStart,
			r: t.redirectEnd - t.redirectStart,
			req: t.responseStart - t.requestStart,
			res: t.responseEnd - t.responseStart,
			dom_p: t.domComplete - t.domInteractive,
			user_w: t.domLoading - t.navigationStart,
			dom_r: t.domInteractive - t.navigationStart,
			dom_ur: t.domContentLoadedEventEnd - t.navigationStart,
			ttfb: t.responseStart - t.navigationStart,
			load: t.loadEventEnd - t.navigationStart
		}
	},
	r.prototype.get_resource_timing_main_index = function(t) {
		for (var e = this.win.performance.getEntries(), n = [], r = 0; r < e.length; r++) {
			var i = e[r];
			"function" == typeof t && !0 !== t(i) || "resource" == i.entryType && n.push({
				d: i.duration.toFixed(0),
				n: i.name,
				t: i.initiatorType || i.entryType,
				s: i.startTime.toFixed(0),
				m: {
					r: i.redirectEnd - i.redirectStart,
					dns: i.domainLookupEnd - i.domainLookupStart,
					req: i.responseEnd - i.requestStart,
					tcp: i.connectEnd - i.connectStart
				}
			})
		}
		return n
	},
	r.prototype.generate_url = function() {
		var t = [];
		t.push("t=" + n),
		t.push("cw=" + screen.width),
		t.push("ch=" + screen.height),
		t.push("e=" + encodeURIComponent(this.config.env));
		var e = {
			t: (this.win.performance.timeOrigin || this.win.performance.timing.navigationStart).toFixed(0),
			n: {
				t: this.win.performance.navigation.type,
				rc: this.win.performance.navigation.redirectCount
			},
			m: this.get_timing_index(),
			c: this.get_mark_info(),
			r: this.get_resource_timing_main_index(this.get_resources_predicates())
		};
		return t.push("d=" + encodeURIComponent(JSON.stringify(e))),
		this.config.perf_url + "?ts=" + (new Date).getTime() + "&" + t.join("&")
	},
	r.prototype.get_resources_predicates = function() {
		return "function" == typeof this.resources_predicates ? this.resources_predicates: i
	},
	r.prototype.set_resource_predicates = function(t) {
		this.resources_predicates = t
	},
	r.prototype.get_mark_info = function() {
		for (var t = this.win.performance.getEntriesByType("mark"), e = {},
		n = 0; n < t.length; n++) {
			var r = t[n],
			i = r.startTime.toFixed(0);
			e[r.name] = i
		}
		return e
	},
	r.prototype.send = function() {
		if (this.should_report()) {
			var t = this;
			setTimeout(function() {
				e(t.generate_url())
			},
			200)
		}
	},
	r.prototype.mark = function(t) {
		this.win.performance && this.win.performance.mark && this.win.performance.mark(t)
	},
	r.prototype.should_report = function() {
		return Math.random() < this.get_sampling()
	},
	r.prototype.get_sampling = function() {
		return this.send_sampling || this.config.sampling
	},
	r.prototype.change_sampling = function(t) {
		this.send_sampling = t
	};
	var o = new r(t, {
		perf_url: "https://www.popular123.com/t.gif",
		env: t.cts.get_env(),
		sampling: parseFloat("0.1")
	});
	return {
		mark: function(t) {
			o.mark(t)
		},
		sampling: function(t) {
			o.change_sampling(t)
		},
		resources_filter: function(t) {
			o.set_resource_predicates(t)
		}
	}
} (window);
