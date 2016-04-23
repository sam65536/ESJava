// Generated by CoffeeScript 1.10.0

/*
@author  Oleg Mazko <o.mazko@mail.ru>
@license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

(function() {
  var Dict, GenericVisitor, MemberScope, MicroVisitor, ScopeVisitor, VarScope, builders, estypes, ref,
    slice = [].slice,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  estypes = require('ast-types');

  Dict = require('../collections/Dict');

  ref = require('../GenericVisitor'), GenericVisitor = ref.GenericVisitor, MicroVisitor = ref.MicroVisitor;

  builders = estypes.builders;

  VarScope = (function() {
    var VarModel;

    VarModel = (function() {
      function VarModel(type1, _static, _private, _super) {
        this.type = type1;
        this["static"] = _static != null ? _static : false;
        this["private"] = _private != null ? _private : false;
        this["super"] = _super != null ? _super : false;
      }

      return VarModel;

    })();

    function VarScope(src, arg) {
      var _unique_var_validator, _vars;
      if (src == null) {
        src = null;
      }
      _vars = (arg != null ? arg : {
        _vars: new Dict
      })._vars;
      this.contains = _vars.contains;
      this.get_type = function(name, def) {
        var ref1;
        if (def == null) {
          def = null;
        }
        return ((ref1 = _vars.get_value(name)) != null ? ref1.type : void 0) || def;
      };
      this.is_static = function(name) {
        var ref1;
        return !!((ref1 = _vars.get_value(name)) != null ? ref1["static"] : void 0);
      };
      this.is_private = function(name) {
        var ref1;
        return !!((ref1 = _vars.get_value(name)) != null ? ref1["private"] : void 0);
      };
      this.clone = function() {
        return new this.constructor(null, {
          _vars: _vars.clone()
        });
      };
      this.clone_super = function() {
        var su_fields, vars;
        vars = new Dict;
        su_fields = [];
        _vars.each(function(k, v) {
          var model;
          if (!v["private"]) {
            model = new VarModel(v.type, v["static"], false, true);
            vars.set_value(k, model);
          }
          model = new VarModel(v.type, v["static"], v["private"], true);
          model.name = k;
          return su_fields.push(model);
        });
        return [
          su_fields, new this.constructor(null, {
            _vars: vars
          })
        ];
      };
      _unique_var_validator = [];
      this.collect_from = function(src) {
        var VarCollector, safe_vars_set;
        safe_vars_set = function() {
          var args, nm;
          nm = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
          if (indexOf.call(_unique_var_validator, nm) >= 0) {
            throw "ASSERT: Duplicate Variable < " + nm + " >";
          }
          _unique_var_validator.push(nm);
          return _vars.set_value.apply(_vars, [nm].concat(slice.call(args)));
        };
        VarCollector = (function(superClass) {
          extend(VarCollector, superClass);

          function VarCollector() {
            return VarCollector.__super__.constructor.apply(this, arguments);
          }

          VarCollector.prototype.visitSingleVariableDeclaration = function() {
            var args, decl, model, node, type;
            node = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
            decl = this.visit.apply(this, [node.name].concat(slice.call(args)));
            type = this.visit.apply(this, [node.type].concat(slice.call(args)));
            model = new VarModel(type);
            return safe_vars_set(decl.name, model);
          };

          VarCollector.prototype.visitVariableDeclarationStatement = function() {
            var args, decl, decls, has_static, i, len, model, node, type;
            node = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
            decls = this.visit.apply(this, [node.fragments].concat(slice.call(args)));
            type = this.visit.apply(this, [node.type].concat(slice.call(args)));
            has_static = this.constructor.has_modifier(node, 'static');
            model = new VarModel(type, has_static);
            for (i = 0, len = decls.length; i < len; i++) {
              decl = decls[i];
              safe_vars_set(decl.id.name, model);
            }
            return model;
          };

          VarCollector.prototype.visitFieldDeclaration = function() {
            var args, model, node;
            node = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
            model = this.visitVariableDeclarationStatement.apply(this, [node].concat(slice.call(args)));
            return model["private"] = this.constructor.has_modifier(node, 'private');
          };

          VarCollector.prototype.visitCatchClause = function() {
            var args, node;
            node = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
            return this.visit.apply(this, [node.exception].concat(slice.call(args)));
          };

          VarCollector.prototype.visitVariableDeclarationFragment = function() {
            var args, id, node;
            node = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
            id = this.visit.apply(this, [node.name].concat(slice.call(args)));
            return builders.variableDeclarator(id, null);
          };

          VarCollector.prototype.visitForStatement = function() {
            var args, node;
            node = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
            return this.visit.apply(this, [node.initializers].concat(slice.call(args)));
          };

          VarCollector.prototype.visitVariableDeclarationExpression = function() {
            var args, node;
            node = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
            return this.visitVariableDeclarationStatement.apply(this, [node].concat(slice.call(args)));
          };

          VarCollector.prototype.visitAssignment = function() {
            var args, node;
            node = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
            return this.constructor.IGNORE_ME;
          };

          VarCollector.prototype.visitTypeDeclaration = function() {
            var args, node;
            node = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
            throw 'NotImpl: Nested | Inner classes ?';
          };

          return VarCollector;

        })(MicroVisitor);
        return new VarCollector().visit(src);
      };
      if (src) {
        this.collect_from(src);
      }
    }

    return VarScope;

  })();

  MemberScope = (function() {
    var MethodModel, validate;

    validate = function(fields, methods, su_fields, su_methods) {
      var f, i, j, l, len, len1, len2, len3, m, n, o, ref1, results;
      for (i = 0, len = su_fields.length; i < len; i++) {
        f = su_fields[i];
        if (!(!f["static"] && fields.contains(f.name) && !fields.is_static(f.name))) {
          continue;
        }
        if (f["private"]) {
          throw "NotImpl: field < " + f.name + " > conflicts with super private one";
        }
        if (fields.is_private(f.name)) {
          throw "NotImpl: private field < " + f.name + " > conflicts with super one";
        }
      }
      for (j = 0, len1 = su_methods.length; j < len1; j++) {
        m = su_methods[j];
        if (!(!m["static"] && methods.contains(m.name, new Array(m.overload)) && !methods.is_static(m.name, new Array(m.overload)))) {
          continue;
        }
        if (m["private"]) {
          throw "NotImpl: method < " + m.name + " > conflicts with super private one";
        }
        if (methods.is_private(m.name, new Array(m.overload))) {
          throw "NotImpl: private method < " + m.name + " > conflicts with super one";
        }
      }
      ref1 = methods.ls_potential_overloads();
      results = [];
      for (l = 0, len2 = ref1.length; l < len2; l++) {
        o = ref1[l];
        for (n = 0, len3 = su_fields.length; n < len3; n++) {
          f = su_fields[n];
          if (!o["static"] && !f["static"] && f.name === o.name) {
            throw "NotImpl: method < " + o.name + " > conflicts with same super field";
          }
        }
        if (fields.contains(o.name) && (o["static"] === fields.is_static(o.name))) {
          throw "NotImpl: field < " + o.name + " > conflicts with same method";
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    MethodModel = (function() {
      function MethodModel(type1, overload1, _static, _private, _super, ctor) {
        this.type = type1;
        this.overload = overload1;
        this["static"] = _static != null ? _static : false;
        this["private"] = _private != null ? _private : false;
        this["super"] = _super != null ? _super : false;
        this.ctor = ctor != null ? ctor : false;
      }

      return MethodModel;

    })();

    function MemberScope(cls_node, arg) {
      var MembersCollector, _fields, _methods, _su_fields, _su_methods, ref1;
      ref1 = arg != null ? arg : {
        _fields: new VarScope,
        _methods: new Dict,
        _su_fields: [],
        _su_methods: []
      }, _fields = ref1._fields, _methods = ref1._methods, _su_fields = ref1._su_fields, _su_methods = ref1._su_methods;
      this.clone_super = function(cls_node) {
        var fields, methods, ref2, su_fields, su_methods;
        methods = new Dict;
        su_methods = slice.call(_su_methods);
        _methods.each(function(k, v) {
          var i, len, m, model, results;
          model = (function() {
            var i, len, results;
            results = [];
            for (i = 0, len = v.length; i < len; i++) {
              m = v[i];
              if (!m["private"]) {
                results.push(new MethodModel(m.type, m.overload, m["static"], false, true, m.ctor));
              }
            }
            return results;
          })();
          if (model.length) {
            methods.set_value(k, model);
          }
          results = [];
          for (i = 0, len = v.length; i < len; i++) {
            m = v[i];
            model = new MethodModel(m.type, m.overload, m["static"], m["private"], true, m.ctor);
            model.name = k;
            results.push(su_methods.push(model));
          }
          return results;
        });
        ref2 = _fields.clone_super(), su_fields = ref2[0], fields = ref2[1];
        su_fields = slice.call(_su_fields).concat(slice.call(su_fields));
        return new this.constructor(cls_node, {
          _fields: fields,
          _methods: methods,
          _su_fields: su_fields,
          _su_methods: su_methods
        });
      };
      MembersCollector = (function(superClass) {
        extend(MembersCollector, superClass);

        function MembersCollector() {
          return MembersCollector.__super__.constructor.apply(this, arguments);
        }

        MembersCollector.prototype.visitFieldDeclaration = function() {
          var args, node;
          node = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
          return _fields.collect_from(node);
        };

        MembersCollector.prototype.visitMethodDeclaration = function() {
          var args, has_private, has_static, i, id, len, model, models, node, overload, retype;
          node = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
          id = this.visit.apply(this, [node.name].concat(slice.call(args)));
          retype = this.visit.apply(this, [node.returnType2].concat(slice.call(args)));
          models = _methods.get_value(id.name, []);
          overload = node.parameters.length;
          for (i = 0, len = models.length; i < len; i++) {
            model = models[i];
            if (overload === model.overload && !model["super"]) {
              throw 'NotImpl: Overload by argumens type ' + id.name;
            }
          }
          models = (function() {
            var j, len1, results;
            results = [];
            for (j = 0, len1 = models.length; j < len1; j++) {
              model = models[j];
              if (overload !== model.overload) {
                results.push(model);
              }
            }
            return results;
          })();
          has_static = this.constructor.has_modifier(node, 'static');
          has_private = this.constructor.has_modifier(node, 'private');
          models.push(new MethodModel(retype, overload, has_static, has_private, false, node.constructor));
          return _methods.set_value(id.name, models);
        };

        MembersCollector.prototype.visitTypeDeclaration = function() {
          var args, node;
          node = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
          if (node !== cls_node) {
            throw 'NotImpl: Nested | Inner classes ?';
          }
          this.visit.apply(this, [node.bodyDeclarations].concat(slice.call(args)));
          return this.visit.apply(this, [node.name].concat(slice.call(args)));
        };

        return MembersCollector;

      })(MicroVisitor);
      this.scope_id = new MembersCollector().visit(cls_node);
      this.fields = ['get_type', 'contains', 'is_static', 'is_private'].reduce(function(left, right) {
        return GenericVisitor.set_prop({
          obj: left,
          prop: right,
          value: _fields[right]
        });
      }, {});
      this.methods = {
        contains: (function(_this) {
          return function() {
            var args, ref2;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return null !== (ref2 = _this.methods).get_type.apply(ref2, args);
          };
        })(this),
        get_type: function(name, params) {
          var i, len, model, ref2;
          ref2 = _methods.get_value(name, []);
          for (i = 0, len = ref2.length; i < len; i++) {
            model = ref2[i];
            if (params.length === model.overload) {
              return model.type;
            }
          }
          return null;
        },
        is_static: function(name, params) {
          var i, len, model, ref2;
          ref2 = _methods.get_value(name, []);
          for (i = 0, len = ref2.length; i < len; i++) {
            model = ref2[i];
            if (params.length === model.overload) {
              return !!model["static"];
            }
          }
          return false;
        },
        is_private: function(name, params) {
          var i, len, model, ref2;
          ref2 = _methods.get_value(name, []);
          for (i = 0, len = ref2.length; i < len; i++) {
            model = ref2[i];
            if (params.length === model.overload) {
              return !!model["private"];
            }
          }
          return false;
        },
        ls_potential_overloads: function() {
          var ls;
          ls = [];
          _methods.each(function(k, v) {
            var c, instances, o, statics;
            o = (function() {
              var i, len, results;
              results = [];
              for (i = 0, len = v.length; i < len; i++) {
                c = v[i];
                if (!c["super"] && !c["private"] && !c.ctor) {
                  results.push(c);
                }
              }
              return results;
            })();
            statics = (function() {
              var i, len, results;
              results = [];
              for (i = 0, len = o.length; i < len; i++) {
                c = o[i];
                if (c["static"]) {
                  results.push(c.overload);
                }
              }
              return results;
            })();
            if (statics.length) {
              ls.push({
                name: k,
                "static": true,
                pars: statics
              });
            }
            instances = (function() {
              var i, len, results;
              results = [];
              for (i = 0, len = o.length; i < len; i++) {
                c = o[i];
                if (!c["static"]) {
                  results.push(c.overload);
                }
              }
              return results;
            })();
            if (instances.length) {
              return ls.push({
                name: k,
                "static": false,
                pars: instances
              });
            }
          });
          return ls;
        },
        overload: function(name, params) {
          var methods;
          methods = _methods.get_value(name);
          if (methods != null ? methods.length : void 0) {
            return name + '$esjava$' + params.length;
          } else {
            return name;
          }
        }
      };
      validate(this.fields, this.methods, _su_fields, _su_methods);
    }

    return MemberScope;

  })();

  ScopeVisitor = (function(superClass) {
    extend(ScopeVisitor, superClass);

    function ScopeVisitor() {
      return ScopeVisitor.__super__.constructor.apply(this, arguments);
    }

    ScopeVisitor.prototype.visitTypeDeclaration = function() {
      var args, members, node, su;
      node = arguments[0], members = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
      members || (members = new MemberScope(node));
      su = ScopeVisitor.__super__.visitTypeDeclaration.apply(this, [node, members].concat(slice.call(args)));
      return function(lazy) {
        return su(function(id, decls, su) {
          return lazy(id, decls, su, members);
        });
      };
    };

    ScopeVisitor.prototype.visitVariableDeclarationStatement = function() {
      var args, locals, members, node;
      node = arguments[0], members = arguments[1], locals = arguments[2], args = 4 <= arguments.length ? slice.call(arguments, 3) : [];
      locals.collect_from(node);
      return ScopeVisitor.__super__.visitVariableDeclarationStatement.apply(this, [node, members, locals].concat(slice.call(args)));
    };

    ScopeVisitor.prototype.visitCatchClause = function() {
      var args, locals, members, node;
      node = arguments[0], members = arguments[1], locals = arguments[2], args = 4 <= arguments.length ? slice.call(arguments, 3) : [];
      locals = locals.clone();
      locals.collect_from(node);
      return ScopeVisitor.__super__.visitCatchClause.apply(this, [node, members, locals].concat(slice.call(args)));
    };

    ScopeVisitor.prototype.visitForStatement = function() {
      var args, locals, members, node;
      node = arguments[0], members = arguments[1], locals = arguments[2], args = 4 <= arguments.length ? slice.call(arguments, 3) : [];
      locals = locals.clone();
      locals.collect_from(node);
      return ScopeVisitor.__super__.visitForStatement.apply(this, [node, members, locals].concat(slice.call(args)));
    };

    ScopeVisitor.prototype.visitMethodDeclaration = function() {
      var args, locals, members, node, su;
      node = arguments[0], members = arguments[1], locals = arguments[2], args = 4 <= arguments.length ? slice.call(arguments, 3) : [];
      locals = new VarScope(node.parameters);
      su = ScopeVisitor.__super__.visitMethodDeclaration.apply(this, [node, members, locals].concat(slice.call(args)));
      return function(lazy) {
        return su(function(id, params, body) {
          return lazy(id, params, body, locals);
        });
      };
    };

    ScopeVisitor.prototype.visitBlock = function() {
      var args, locals, members, node;
      node = arguments[0], members = arguments[1], locals = arguments[2], args = 4 <= arguments.length ? slice.call(arguments, 3) : [];
      return ScopeVisitor.__super__.visitBlock.apply(this, [node, members, locals.clone()].concat(slice.call(args)));
    };

    return ScopeVisitor;

  })(GenericVisitor);

  module.exports = ScopeVisitor;

}).call(this);