import { SpotLightHelper } from "three";
import { editable as e } from "@theatre/r3f";
import { extend, useThree, useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";

extend({ SpotLightHelper })
// eslint-disable-next-line react/prop-types
const SpotLightWithHelper = ({ showHelper = true, ...props }) => {

    const { scene } = useThree()
    const ref = useRef()
    const helperRef = useRef()

    useEffect(() => {
        if (showHelper) {
            helperRef.current = new SpotLightHelper(ref.current)
            scene.add(helperRef.current)

            return () => {
                scene.remove(helperRef.current)
                helperRef.current.dispose()
            }
        }
    }, [scene, showHelper]);

    useFrame(() => {
        if (showHelper && helperRef.current) {
            helperRef.current.update()
        }
    })

    return (
        <>
            <e.spotLight ref={ref} {...props} />
        </>
    )
}

export default SpotLightWithHelper