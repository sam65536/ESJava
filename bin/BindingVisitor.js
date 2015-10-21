// Generated by CoffeeScript 1.10.0

/*
@author  Oleg Mazko <o.mazko@mail.ru>
@license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

(function() {
  var BindingVisitor, ClassBinding, GenericVisitor, estypes,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

  GenericVisitor = require('./GenericVisitor').GenericVisitor;

  ClassBinding = require('./binding/ClassBinding');

  estypes = require('ast-types');

  BindingVisitor = (function(superClass) {
    var builders, flatten, make_method, make_static_get, make_static_set;

    extend(BindingVisitor, superClass);

    function BindingVisitor() {
      return BindingVisitor.__super__.constructor.apply(this, arguments);
    }

    builders = estypes.builders;

    make_method = function(id, params, body, is_static, kind) {
      var fn;
      if (is_static == null) {
        is_static = false;
      }
      if (kind == null) {
        kind = 'method';
      }
      fn = builders.functionDeclaration(id, params, body);
      return builders.methodDefinition(kind, id, fn, is_static);
    };

    make_static_get = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return make_method.apply(null, slice.call(args).concat([true], ['get']));
    };

    make_static_set = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return make_method.apply(null, slice.call(args).concat([true], ['set']));
    };

    flatten = function(array_of_array) {
      return [].concat.apply([], array_of_array);
    };

    BindingVisitor.prototype.visitTypeDeclaration = function() {
      var args, binding, node, su;
      node = arguments[0], binding = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
      binding = new ClassBinding(node);
      su = BindingVisitor.__super__.visitTypeDeclaration.apply(this, [node, binding].concat(slice.call(args)));
      return (function(_this) {
        return function(lazy) {
          return su(function(id, decls, su) {
            var ctor_inits, expr, init;
            decls = flatten(decls);
            ctor_inits = (function() {
              var i, len, ref, results;
              ref = binding.ctor_raw_field_inits;
              results = [];
              for (i = 0, len = ref.length; i < len; i++) {
                init = ref[i];
                init = this.visit.apply(this, [init, binding].concat(slice.call(args)));
                init.id = builders.memberExpression(builders.thisExpression(), init.id, false);
                expr = builders.assignmentExpression('=', init.id, init.init);
                results.push(builders.expressionStatement(expr));
              }
              return results;
            }).call(_this);
            delete binding.ctor_raw_field_inits;
            return lazy(id, decls, su, ctor_inits, binding);
          });
        };
      })(this);
    };

    BindingVisitor.prototype.visitFieldDeclaration = function() {
      var args, binding, body, body_set, decl, del, expr, fragment, frags, getter, is_prim, node, operand, param, ref, type;
      node = arguments[0], binding = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
      if (this.constructor.has_modifier(node, 'static')) {
        type = this.visit.apply(this, [node.type, binding].concat(slice.call(args)));
        is_prim = (ref = type.name) === 'long' || ref === 'byte' || ref === 'int' || ref === 'short' || ref === 'double' || ref === 'float' || ref === 'boolean' || ref === 'String' || ref === 'char';
        frags = (function() {
          var i, len, ref1, results;
          ref1 = node.fragments;
          results = [];
          for (i = 0, len = ref1.length; i < len; i++) {
            fragment = ref1[i];
            decl = this.visit.apply(this, [fragment, binding].concat(slice.call(args)));
            if (decl.init == null) {
              decl.init = this.visit.apply(this, [this.constructor.make_def_field_init(node), binding].concat(slice.call(args)));
            }
            if (is_prim && !fragment.extraDimensions && this.constructor.has_modifier(node, 'final')) {
              body = builders.blockStatement([builders.returnStatement(decl.init)]);
              results.push(make_static_get(decl.id, [], body));
            } else {
              operand = builders.memberExpression(binding.class_id, decl.id, false);
              del = builders.unaryExpression('delete', operand, false);
              del = builders.expressionStatement(del);
              expr = builders.assignmentExpression('=', operand, decl.init);
              body = builders.blockStatement([del, builders.returnStatement(expr)]);
              getter = make_static_get(decl.id, [], body);
              if (!this.constructor.has_modifier(node, 'final')) {
                param = builders.identifier('value');
                expr = builders.assignmentExpression('=', operand, param);
                expr = builders.expressionStatement(expr);
                body_set = builders.blockStatement([del, expr]);
                results.push([getter, make_static_set(decl.id, [param], body_set)]);
              } else {
                results.push(getter);
              }
            }
          }
          return results;
        }).call(this);
        return flatten(frags);
      } else {
        return this.constructor.IGNORE_ME;
      }
    };

    BindingVisitor.prototype.visitSimpleName = function() {
      var args, binding, node, su;
      node = arguments[0], binding = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
      su = BindingVisitor.__super__.visitSimpleName.apply(this, [node, binding].concat(slice.call(args)));
      if (binding) {
        binding.bind({
          id: su,
          foreign: node
        });
      }
      return su;
    };

    return BindingVisitor;

  })(GenericVisitor);

  module.exports = BindingVisitor;

}).call(this);