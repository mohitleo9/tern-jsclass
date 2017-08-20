(function(mod) {
	if (typeof exports == 'object' && typeof module == 'object')  // CommonJS
	    return mod(require.main.require('tern/lib/infer'), require.main.require('tern/lib/tern'));

	if (typeof define == 'function' && define.amd) // AMD
	    return define([ 'tern/lib/infer', 'tern/lib/tern' ], mod);
	mod(tern, tern);
})(mod);

function mod(infer, tern) {
	tern.registerPlugin('jsclass', function(server) {
	    server.addDefs(defs);
	});

	function getClassName(args, argNodes, cx) {
	    if (args[0] === cx.str)
		  return argNodes[0].raw;

	};

	function propagateProperties(source, destination) {

	    const methods =  source.getProp('methods');
	    const fields = source.getProp('fields');
	    methods.forAllProps(function(prop, val, local) {
		  // let's focus on just the local ones for now
		  if (!local) return;

		  // connect the value to destination prop
		  // destination.prop = val
		  val.propagate(destination.defProp(prop));
	    });


	    fields.forAllProps(function(prop, val, local) {
		  // let's focus on just the local ones for now
		  const valType = val.getType();
		  if (!local) return;

		  // the 'type' of this field that we are interested in.
		  let typeAlreadySet;

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
	    let customClass;
	    const cx = infer.cx();

	    if (args[0].getType() instanceof infer.Fn)
		  // we are just extending props.
		  customClass = args[0].getType();

	    else
		  customClass = new infer.Fn(getClassName(args, argNodes, cx), new infer.Obj(true), [], [], new infer.AVal());


	    if (args.length <= 1)
		  return customClass;

	    const newProperties = args[1];
	    const classPrototype = customClass.getProp('prototype').getType();

	    propagateProperties(newProperties, classPrototype);
	    return customClass;
	});


	const defs = {
	    '!name'   : 'jsclass',
	    '!define' : {
		  '!known_modules' : {
			JSClass : {
			      '!type' : 'JS',
			},
		  },
	    },
	    'JS' : {
		  class : {
			'!type' : 'fn(properties: ?) -> !custom:createCustomClass',
		  },
	    },
	};
};
