

export default class AnimationBuilder {
    constructor() {
        this.frames = [];
        this.keyFrames = [];
    }

    addState(state) {
        let frame = []
        this.addTransformation(frame, state)
        this.frames.push(frame)
    }

    addTransformation(frame, state) {
        const transformation = {
            translation: state.translation,
            rotation: state.rotation,
            scale: state.scale,
            subtree_translate: state.subtree_translate,
            subtree_rotate: state.subtree_rotate,
            subtree_scale: state.subtree_scale,
        }
        frame.push(transformation)
        for(let child of state.children) {
            this.addTransformation(frame, child)
        }
    }

    





}