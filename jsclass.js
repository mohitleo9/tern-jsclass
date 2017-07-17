(function(mod) {
  if (typeof exports == "object" && typeof module == "object") { // CommonJS
    return mod(require.main.require("../lib/infer"), require.main.require("../lib/tern"));
  }
  if (typeof define == "function" && define.amd) // AMD
    return define([ "tern/lib/infer", "tern/lib/tern" ], mod);
  mod(tern, tern);
})(function(infer, tern) {
  "use strict";

  tern.registerPlugin("jsclass", function(server, options) {
    server.addDefs(defs);
  });

  function getClassName(args, argNodes, cx) {
    if (args[0] === cx.str){
      return argNodes[0].raw;
    }
  };

  function propagateProperties(source, destination){

    var cx = infer.cx();

    var methods =  source.getProp('methods');
    var fields = source.getProp('fields');
    methods.forAllProps(function(prop, val, local){
      // let's focus on just the local ones for now
      if (!local) return;

      // connect the value to destination prop
      // destination.prop = val
      val.propagate(destination.defProp(prop));
    });


    fields.forAllProps(function(prop, val, local){
      // let's focus on just the local ones for now
      var valType = val.getType();
      if (!local) return;

      // the 'type' of this field that we are interested in.
      var typeAlreadySet;

      if (valType && valType.originNode && valType.hasProp('type')) {
	destination.defProp(prop).addType(valType.getProp('type'));
	typeAlreadySet = true;

	// valType.originNode.properties.forEach(({ key, value }) => {
	//   if (key.name && key.name === 'type') {
	//     if (value.raw) {
	//       destination.defProp(prop).addType(cx.str);
	//       typeAlreadySet = true;
	//     }
	//   }
	// });

      }

      // connect the value to destination prop
      // destination.prop = val
      !typeAlreadySet && val.propagate(destination.defProp(prop));
    });
  };

  infer.registerFunction('createCustomClass', function(_self, args, argNodes) {
    var customClass, newProperties, classPrototype;
    var cx = infer.cx();

    if (args[0].getType() instanceof infer.Fn){
      // we are just extending props.
      customClass = args[0].getType();
    }
    else {
      customClass = new infer.Fn(getClassName(args, argNodes, cx), new infer.Obj(true), [], [], new infer.AVal);
    }

    if (args.length <= 1)
      return customClass;

    newProperties = args[1];
    classPrototype = customClass.getProp("prototype").getType();

    propagateProperties(newProperties, classPrototype);
    return customClass;
  });


  var defs = {
    "!name": "jsclass",
    "!define": {
    },
    "JS": {
      "class": {
	"!type": "fn(properties: ?) -> !custom:createCustomClass",
      },
    },
  }
});
