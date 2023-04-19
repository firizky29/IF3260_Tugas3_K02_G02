

class AnimationBuilder {
    constructor(webgl) {
        this.webgl = webgl;
        this.frames = [];
        this.currentFrame = [];
        this.isPlaying = true;
    }

    addState(model) {
        // console.log("size", GeometryOp.countSubtreeSize(model))
        this.currentFrame = new Array(GeometryOp.countSubtreeSize(model));
        this.addTransformation(model)
        this.frames.push(this.currentFrame)
        // this.currentFrame[0] = 0;
        // console.log(this.currentFrame)
    }

    addTransformation(model, idx = 0) {
        const transformation = {
            translation: [...model.translation],
            rotation: [...model.rotation],
            scale: [...model.scale],
            subtree_translate: [...model.subtree_translate],
            subtree_rotate: [...model.subtree_rotate],
            subtree_scale: [...model.subtree_scale],
        }
        this.currentFrame[idx] = transformation;
        idx ++;
        for(let child of model.children) {
            this.addTransformation(child, idx)
            idx += GeometryOp.countSubtreeSize(child);
        }
        // console.log("add transformation", model)
    }

    setIsPlaying(isPlaying) {
        this.isPlaying = isPlaying;
    }

    playFrames(state, idx = 0){
        if(!this.isPlaying || this.frames.length == 0){
            return;
        }

        if(idx >= this.frames.length){
            idx = idx%this.frames.length;
        }
        // window request animation
        let model = state.model;
        // console.log("state sebelum update", state.model)
        this._applyFrame(model, this.frames[idx]);
        // state.model = model;
        // console.log("state", state.model)
        // console.log("frames", this.frames[idx]);
        this.webgl.drawArticulated(state)
        idx ++;
        window.requestAnimationFrame(() => this.playFrames(state, idx))
    }

    _applyFrame(model, frame, idx = 0) {
        // console.log(frame)
        model.translation = frame[idx].translation;
        model.rotation = frame[idx].rotation;
        model.scale = frame[idx].scale;
        model.subtree_translate = frame[idx].subtree_translate;
        model.subtree_rotate = frame[idx].subtree_rotate;
        model.subtree_scale = frame[idx].subtree_scale;
        // console.log("model", model)
        // console.log(model)
        idx ++;
        for(let i = 0; i < model.children.length; i++) {
            this._applyFrame(model.children[i], frame, idx)
            idx += GeometryOp.countSubtreeSize(model.children[i]);
        }
    }

    lerpFrames(frame1, frame2, idx=0, cnt=10) {
        
    }
        
}

// export default AnimationBuilder;
