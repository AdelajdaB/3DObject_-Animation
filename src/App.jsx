import { Canvas, useFrame } from "@react-three/fiber";
import Jet from "./model/Jet.jsx";
import {Environment, ScrollControls, useScroll} from "@react-three/drei";
import { getProject, val } from "@theatre/core";
import { SheetProvider, PerspectiveCamera, useCurrentSheet } from "@theatre/r3f";
import SpotLightWithHelper from "./SpotLightWithHelper.jsx";
import { useAtom } from "jotai";
import { currentPageAtom, currentSceneAtom } from "./GlobalState.js";
import jetAnimation from './jet_animation.json'


function App() {

    const sheet = getProject('Jet', { state: jetAnimation }).sheet('Scene')

    return (
        <>
            <Canvas gl={{physicallyCorrectLights: true, preserveDrawingBuffer: true }}>
                <ScrollControls pages={15} distance={1} damping={0.3} maxSpeed={0.1}>
                    <SheetProvider sheet={sheet}>
                        <Scene />
                    </SheetProvider>
                </ScrollControls>
            </Canvas>
        </>
    )
}

export default App

const Scene = () => {

    const sheet = useCurrentSheet()
    const scroll = useScroll()

    const [currentPage, setCurrentPage] = useAtom(currentPageAtom)
    const [currentScene, setCurrentScene] = useAtom(currentSceneAtom)

    const sequenceLength = val(sheet.sequence.pointer.length)

    function logCurrentPageCallback(scroll, callback) {
        const scenePerPage = 2
        const currentPage = Math.floor(scroll.offset * scroll.pages) + 1
        const positionWithinPage = (scroll.offset * scroll.pages) % 1

        const sceneOffsetForCurrentPage = Math.floor(positionWithinPage * scenePerPage) + 1
        const computedScene = (currentPage - 1 ) * scenePerPage + sceneOffsetForCurrentPage

        callback(currentPage)
        setCurrentScene(computedScene)
    }

    useFrame(() => {
        if (scroll) {
            logCurrentPageCallback(scroll, setCurrentPage)
            sheet.sequence.position = scroll.offset * sequenceLength
        }
    })

    return(
        <>
            <color attach='background' args={['black']}/>
            <Environment files='city_1.hdr'/>
            <PerspectiveCamera
                theatreKey='Camera'
                makeDefault
                position={[0,0,4]}
                fov={90}
                near={0.1}
                far={170}
            />
            <SpotLightWithHelper theatreKey='Spotlight 1'  position={[0,0,0]} intensity={1} showHelper={false} />
            <SpotLightWithHelper theatreKey='Spotlight 2'  position={[0,0,0]} intensity={1} showHelper={false} />
            <Jet />
        </>
    )
}