uniform float uTime;
uniform float uSize;
uniform vec4 uResolution;

attribute float aScale;
attribute vec3 aRandomness;

varying vec2 vUv;
varying vec3 vColor;
varying vec3 vNormal;

mat3 rotation3dY(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat3(
    c, 0.0, -s,
    0.0, 1.0, 0.0,
    s, 0.0, c
    );
}

vec3 rotateY(vec3 v, float angle) {
    return rotation3dY(angle) * v;
}

void main() {

    vUv = uv;
    vNormal = normal;

    vec3 pos = position;
    pos.x += 0.2 * (sin( pos.x * 20. + uTime ) * 0.5 + 0.5);
    pos.y -= 0.3 * (sin( pos.y * 5. + uTime ) * 0.5 + 0.5);
    pos.z -= 0.2 * (cos( pos.z * 5. + uTime ) * 0.5 + 0.5);
    
    // Position
    vec4 mvPosition = modelViewMatrix * vec4( pos, 1. );
    gl_Position = projectionMatrix * mvPosition ;
    
    // Size
    // gl_PointSize = uSize * aScale;
    // gl_PointSize = 5. * (1. / -mvPosition.z);
    // gl_PointSize = ( 6.0 / -mvPosition.z );
    
    float particleSize = 25.; 
    particleSize *= min(uResolution.a, uResolution.b)/min(16.,9.);
    gl_PointSize = particleSize;

    // Color
    vColor = color;
    
}