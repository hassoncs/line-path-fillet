(window['webpackJsonpfish-fillet'] =
  window['webpackJsonpfish-fillet'] || []).push([
  [0],
  {
    14: function(e, t, n) {
      e.exports = n(36);
    },
    19: function(e, t, n) {},
    20: function(e, t, n) {
      e.exports = {
        App: 'App_App__15LM-',
        'App-logo': 'App_App-logo__1GLNd',
        'App-header': 'App_App-header__3nnPn',
        'App-link': 'App_App-link__TRj1P',
      };
    },
    36: function(e, t, n) {
      'use strict';
      n.r(t);
      var r = n(0),
        a = n.n(r),
        i = n(1),
        o = n.n(i),
        l = (n(19), n(20), n(2)),
        c = n(7),
        s = n(8),
        u = n(9),
        h = n(12),
        d = n(10),
        p = n(13),
        m = n(3),
        v = n.n(m),
        f = n(11),
        y = n.n(f),
        g = function(e, t) {
          return [e[0] - t[0], e[1] - t[1]];
        },
        k = function(e) {
          return e[0] * e[0] + e[1] * e[1];
        },
        E = function(e) {
          return Math.sqrt(k(e));
        },
        _ = function(e, t) {
          return e[0] * t[0] + e[1] * t[1];
        },
        A = function(e, t) {
          return e[0] * t[1] - e[1] * t[0];
        },
        w = function(e, t) {
          var n = Math.cos(t),
            r = Math.sin(t);
          return [e[0] * n - e[1] * r, e[0] * r + e[1] * n];
        },
        P = function(e, t, n) {
          var r = g(n, t),
            a = g(e, t),
            i = k(r),
            o = _(a, r) / i;
          return [t[0] + r[0] * o, t[1] + r[1] * o];
        },
        x = { type: 'none' };
      function M(e, t, n, r) {
        var a = ((r - 90) * Math.PI) / 180;
        return { x: e + n * Math.cos(a), y: t + n * Math.sin(a) };
      }
      var b = (function(e) {
        function t() {
          var e, n;
          Object(s.a)(this, t);
          for (var r = arguments.length, a = new Array(r), i = 0; i < r; i++)
            a[i] = arguments[i];
          return (
            ((n = Object(h.a)(
              this,
              (e = Object(d.a)(t)).call.apply(e, [this].concat(a)),
            )).state = {
              lineA: [[300, 200], [220, 50]],
              lineB: [[400, 100], [200, 100]],
              tanLineA: [[0, 0], [0, 0]],
              intersectionPoint: null,
              circleCenter: null,
              closePointA: null,
              closePointB: null,
              mousePoint: null,
              radius: 50,
              usedRadius: 0,
            }),
            (n._handleMove = function(e) {
              var t = [e.clientX, e.clientY];
              n.setState({ mousePoint: t }), n._findIntersection();
            }),
            (n._onDrag = function(e, t, r) {
              var a = n.state[t].slice();
              (a[r] = e), n.setState(Object(c.a)({}, t, a));
            }),
            n
          );
        }
        return (
          Object(p.a)(t, e),
          Object(u.a)(t, [
            {
              key: 'componentDidMount',
              value: function() {
                this._findIntersection(),
                  (this._mouseMove = document.addEventListener(
                    'mousemove',
                    this._handleMove,
                  ));
              },
            },
            {
              key: 'componentWillUnmount',
              value: function() {
                document.removeEventListener('mousemove', this._mouseMove);
              },
            },
            {
              key: '_findIntersection',
              value: function() {
                var e,
                  t = this.state,
                  n = t.lineA,
                  r = t.lineB,
                  a = t.radius,
                  i = (function(e, t, n, r, a, i, o, l) {
                    var c = (l - i) * (n - e) - (o - a) * (r - t);
                    if (0 == c) return x;
                    var s = ((o - a) * (t - i) - (l - i) * (e - a)) / c;
                    return {
                      type: 'intersecting',
                      point: [e + s * (n - e), t + s * (r - t)],
                    };
                  })(
                    n[0][0],
                    n[0][1],
                    n[1][0],
                    n[1][1],
                    r[0][0],
                    r[0][1],
                    r[1][0],
                    r[1][1],
                  );
                if ('intersecting' === i.type) {
                  e = [i.point[0], i.point[1]];
                  var o = (function(e, t, n, r) {
                      var a = g(e, t),
                        i = g(n, t),
                        o = A(a, i),
                        l = _(a, i),
                        c = Math.atan2(o, l) / 2,
                        s = [E(a), E(i)],
                        u = s[0],
                        h = s[1],
                        d = Math.tan(c),
                        p = Math.min(r, Math.abs(d * u), Math.abs(d * h)),
                        m = p / Math.sin(c),
                        v = [a[0] / u, a[1] / u],
                        f = w([v[0] * m, v[1] * m], c - Math.PI),
                        y = [f[0] + t[0], f[1] + t[1]],
                        k = P(y, e, t),
                        x = P(y, n, t);
                      return {
                        radius: p,
                        angleA:
                          (180 * Math.atan2(k[1] - y[1], k[0] - y[0])) /
                            Math.PI -
                          -90,
                        angleB:
                          (180 * Math.atan2(x[1] - y[1], x[0] - y[0])) /
                            Math.PI -
                          -90,
                        tanPointA: k,
                        tanPointB: x,
                        circleCenter: y,
                      };
                    })(n[0], e, r[0], a),
                    l = o.radius,
                    c = o.angleA,
                    s = o.angleB,
                    u = o.tanPointA,
                    h = o.tanPointB,
                    d = o.circleCenter,
                    p = (function(e, t, n, r, a) {
                      var i = M(e, t, n, a),
                        o = M(e, t, n, r),
                        l = a - r <= 180 ? '0' : '1';
                      return ['M', i.x, i.y, 'A', n, n, 0, l, 0, o.x, o.y].join(
                        ' ',
                      );
                    })(d[0], d[1], l, c, s);
                  this.setState({
                    closePointA: u,
                    closePointB: h,
                    usedRadius: l,
                    arc: p,
                    intersectionPoint: e,
                    circleCenter: d,
                  });
                }
              },
            },
            {
              key: '_renderSvg',
              value: function(e) {
                var t = e.width,
                  n = e.height;
                return a.a.createElement(
                  'svg',
                  {
                    version: '1.1',
                    baseProfile: 'full',
                    width: t,
                    height: n,
                    viewport: ''.concat(t, ' ').concat(n),
                    xmlns: 'http://www.w3.org/2000/svg',
                  },
                  a.a.createElement('g', null, this._renderLines()),
                );
              },
            },
            {
              key: '_renderLines',
              value: function() {
                var e = this.state,
                  t = e.lineA,
                  n = e.lineB,
                  r = e.intersectionPoint,
                  i = (e.mousePoint, e.closePointA),
                  o = e.circleCenter,
                  l = e.closePointB,
                  c = e.radius,
                  s = e.usedRadius,
                  u = e.arc;
                return a.a.createElement(
                  'g',
                  null,
                  o &&
                    a.a.createElement(
                      a.a.Fragment,
                      null,
                      a.a.createElement('circle', {
                        cx: o[0],
                        cy: o[1],
                        r: s || c,
                        stroke: 'lightgrey',
                        strokeWidth: 4,
                        fill: 'none',
                        strokeOpacity: 0.1,
                        style: { pointerEvents: 'none' },
                      }),
                    ),
                  i &&
                    a.a.createElement(
                      a.a.Fragment,
                      null,
                      !1,
                      a.a.createElement('circle', {
                        cx: i[0],
                        cy: i[1],
                        r: '6',
                        stroke: 'none',
                        fill: 'darkred',
                        style: { pointerEvents: 'none' },
                      }),
                    ),
                  l &&
                    a.a.createElement(
                      a.a.Fragment,
                      null,
                      !1,
                      a.a.createElement('circle', {
                        cx: l[0],
                        cy: l[1],
                        r: '6',
                        stroke: 'none',
                        fill: 'darkblue',
                        style: { pointerEvents: 'none' },
                      }),
                    ),
                  u &&
                    a.a.createElement(
                      a.a.Fragment,
                      null,
                      i &&
                        a.a.createElement('line', {
                          x1: t[0][0],
                          y1: t[0][1],
                          x2: i[0],
                          y2: i[1],
                          stroke: 'white',
                          strokeWidth: 6,
                          strokeLinecap: 'round',
                        }),
                      l &&
                        a.a.createElement('line', {
                          x1: n[0][0],
                          y1: n[0][1],
                          x2: l[0],
                          y2: l[1],
                          stroke: 'white',
                          strokeWidth: 6,
                          strokeLinecap: 'round',
                        }),
                      a.a.createElement('path', {
                        d: u,
                        stroke: 'white',
                        strokeWidth: 6,
                        fill: 'none',
                      }),
                    ),
                  this._renderLine(t, 'lineA', 'red'),
                  this._renderLine(n, 'lineB', 'blue'),
                  r &&
                    a.a.createElement(
                      a.a.Fragment,
                      null,
                      a.a.createElement('circle', {
                        cx: r[0],
                        cy: r[1],
                        r: '6',
                        stroke: 'none',
                        fill: 'purple',
                        strokeOpacity: 0.1,
                        style: { pointerEvents: 'none' },
                      }),
                    ),
                );
              },
            },
            {
              key: '_renderLine',
              value: function(e, t, n) {
                var r = this,
                  i = Object(l.a)(e, 2),
                  o = i[0],
                  c = i[1],
                  s = Object(l.a)(o, 2),
                  u = s[0],
                  h = s[1],
                  d = Object(l.a)(c, 2),
                  p = d[0],
                  m = d[1];
                return a.a.createElement(
                  'g',
                  null,
                  a.a.createElement('line', {
                    x1: u,
                    y1: h,
                    x2: p,
                    y2: m,
                    stroke: n,
                    strokeWidth: 4,
                    strokeOpacity: 0.1,
                    strokeLinecap: 'round',
                  }),
                  a.a.createElement(
                    v.a,
                    {
                      defaultPosition: { x: u, y: h },
                      position: { x: u, y: h },
                      onDrag: function(e, n) {
                        var a = n.x,
                          i = n.y;
                        return r._onDrag([a, i], t, 0);
                      },
                    },
                    a.a.createElement('circle', {
                      cx: 0,
                      cy: 0,
                      r: '8',
                      stroke: 'none',
                      fill: n,
                    }),
                  ),
                  a.a.createElement(
                    v.a,
                    {
                      defaultPosition: { x: p, y: m },
                      position: { x: p, y: m },
                      onDrag: function(e, n) {
                        var a = n.x,
                          i = n.y;
                        return r._onDrag([a, i], t, 1);
                      },
                    },
                    a.a.createElement('circle', {
                      cx: 0,
                      cy: 0,
                      r: '4',
                      stroke: 'none',
                      fill: n,
                    }),
                  ),
                );
              },
            },
            {
              key: 'render',
              value: function() {
                var e = this;
                return a.a.createElement(
                  'div',
                  {
                    className: 'root',
                    style: {
                      height: '100%',
                      background: 'grey',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                    },
                  },
                  a.a.createElement(y.a, null, function(t) {
                    var n = t.width,
                      r = t.height;
                    return e._renderSvg({ width: n, height: r });
                  }),
                );
              },
            },
          ]),
          t
        );
      })(a.a.Component);
      var B = function() {
        return a.a.createElement(
          'div',
          { className: 'App' },
          a.a.createElement(b, null),
        );
      };
      Boolean(
        'localhost' === window.location.hostname ||
          '[::1]' === window.location.hostname ||
          window.location.hostname.match(
            /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/,
          ),
      );
      o.a.render(a.a.createElement(B, null), document.getElementById('root')),
        'serviceWorker' in navigator &&
          navigator.serviceWorker.ready.then(function(e) {
            e.unregister();
          });
    },
  },
  [[14, 1, 2]],
]);
//# sourceMappingURL=main.2ae88489.chunk.js.map
