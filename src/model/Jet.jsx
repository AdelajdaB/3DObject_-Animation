import { useGLTF, useAnimations } from "@react-three/drei";
import { useAtom } from "jotai";
import { currentSceneAtom } from "../GlobalState.js";
import {useEffect, useRef, useState} from "react";

const Jet = () => {

    const [currentScene] = useAtom(currentSceneAtom)
    const model = useGLTF('./jet.glb')
    // console.log(model)
    const animations = useAnimations(model.animations, model.scene)
    // console.log(animations)

    const [animationPlayed, setAnimationPlayed] = useState(false)
    const animationDuration = animations.actions['Scene']?.getClip().duration || 0
    const halfDuration = useRef(animationDuration)
    const mixer = animations.mixer

    useEffect(() => {
        // console.log(currentScene)
        if(currentScene >= 15) {
            const action = animations.actions['Scene']
            action.play()

            setTimeout(() => {
                action.paused = true
                mixer.update(halfDuration.current)
                setAnimationPlayed(true)
            }, halfDuration.current * 1000)
        }
    }, [currentScene, animationPlayed, animations.actions, mixer]);

    return(
        <>
            <mesh>
                <primitive object={model.scene} />
            </mesh>
        </>
    )
}

export default Jet;