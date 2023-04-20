

class AnimationBuilder {
    constructor(webgl) {
        this.webgl = webgl;
        this.frames = [];
        this.currentFrame = [];
        this.keyframes = [];
        this.isPlaying = false;
    }

    addState(model) {
        // console.log("size", GeometryOp.countSubtreeSize(model))
        this.currentFrame = new Array(GeometryOp.countSubtreeSize(model));
        this.addTransformation(model)
        if(this.frames.length != 0){
            const lerpFrames = this.lerpFrames(this.frames[this.frames.length-1], this.currentFrame)
            this.frames = this.frames.concat(lerpFrames)
        }
        this.frames.push(this.currentFrame)
        console.log(this.frames)
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
        let model = state.model;
        this._applyFrame(model, this.frames[idx]);
        state.model = model;
        // console.log(state.model)

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
        idx ++;
        for(let i = 0; i < model.children.length; i++) {
            this._applyFrame(model.children[i], frame, idx)
            idx += GeometryOp.countSubtreeSize(model.children[i]);
        }
    }

    lerpFrames(frame1, frame2, cnt=100) {
        let lerpFrames = []
        for(let i = 1; i <= cnt; i++) {
            let frame = new Array(frame1.length);
            for(let j=0; j<frame1.length; j++){
                frame[j] = {
                    translation: GeometryOp.lerp(frame1[j].translation, frame2[j].translation, i/(cnt+1)),
                    rotation: GeometryOp.lerp(frame1[j].rotation, frame2[j].rotation, i/(cnt+1)),
                    scale: GeometryOp.lerp(frame1[j].scale, frame2[j].scale, i/(cnt+1)),
                    subtree_translate: GeometryOp.lerp(frame1[j].subtree_translate, frame2[j].subtree_translate, i/(cnt+1)),
                    subtree_rotate: GeometryOp.lerp(frame1[j].subtree_rotate, frame2[j].subtree_rotate, i/(cnt+1)),
                    subtree_scale: GeometryOp.lerp(frame1[j].subtree_scale, frame2[j].subtree_scale, i/(cnt+1)),
                }    
            }
            lerpFrames.push(frame);
        }
        return lerpFrames;
    }
        
}

// export default AnimationBuilder;
