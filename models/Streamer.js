class Streamer {
    constructor(id, name, stream) {
        this.id = id;
        this.name = name;
        this.stream = stream;
    }

    getStreamKey() {
        return this.stream.streamKey;
    }

    getStreamTitle() {
        return this.stream.streamTitle;
    }

    getStreamDescription() {
        return this.stream.streamDescription;
    }
}