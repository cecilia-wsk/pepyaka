uniform float uTime;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vColor;
varying vec3 vNormal;


float PI = 3.141592653589793238;


void main()	{

	vec3 light = vec3(0.);
	vec3 lightDirection = normalize(vec3(0.,0.,0.));

	vec3 skyColor = vec3(1.000,1.000,0.547);
	vec3 groundColor = vec3(0.562,0.275,0.111);

	light += dot(lightDirection, vNormal);

	light = mix(skyColor, groundColor, dot(lightDirection, vNormal));

	// gl_FragColor = vec4(vColor, 1.);
	// gl_FragColor = vec4(vNormal, 1.);
	gl_FragColor = vec4(light*vColor, 1.);

	// vec4 displacement = texture2D(uDisplacement, vUv);
	// float theta = displacement.r*2.*PI;
	
	// vec2 dir = vec2(sin(theta),cos(theta));
	// vec2 uv = vUv + dir*displacement.r*0.1; 

	// gl_FragColor = displacement;

}