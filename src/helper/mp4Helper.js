import lodash from 'lodash';

const mp4Helper = {

  /**
   * This helper method is supposed to generate real world timestamps for each
   * sample based on MP4 container video track metadata. Result timestamps
   * will be sorted.
   *
   * All the metadata should be taken from MP4 container of the video file.
   * All meta is related to a video track.
   *
   * Originally all deltas and offsets in "stts" and "ctts" boxes are specified
   * in custom time units. Timescale is the number of time units that pass
   * in one second. Use timescale to convert time units into real world time.
   *
   * @param {Object} argMetadata - MP4 container track metadata.
   * @param {Number} argMetadata.timescale - of a track.
   * @param {Object} argMetadata.timeToSample - is taken from "stts" box.
   * @param {Object} argMetadata.compositionOffset - is taken from "ctts" box.
   * @return {array} - list of real-world composition timestamps, sorted.
   */
  generateTimestamps: (argMetadata = {}, argOptions = {}) => {
    const meta = lodash.defaultsDeep(argMetadata, {
      timescale: 0,
      timeToSample: {
        sampleCounts: [],
        sampleDeltas: [],
      },
      compositionOffset: {
        sampleCounts: [],
        sampleOffsets: [],
      },
    });

    const options = lodash.defaultsDeep(argOptions, {
      commonOffset: 0,
    });

    // MP4 container "stts" box contains decode time delta's.
    // This box contains a compact version of a table that allows indexing
    // from decoding time to sample number. Each entry in the table gives the
    // number of consecutive samples with the same time delta, and the delta
    // of those samples. By adding thedeltas a complete time-to-sample map may
    // be built.
    //
    //  DT(i+1) = DT(i) + STTS(i)
    //
    // where
    //  STTS(i) is the (uncompressed) table entry for sample i;
    //  DT is the display time for sample (i).
    //
    // Refer to: ISO/IEC 14496-12, Chapter 8.15.2


    // Time of each sample in time units.
    const decodingTimes = [];

    let k = 0;

    for (let i = 0; i < meta.timeToSample.sampleCounts.length; i += 1) {
      const sampleCount = meta.timeToSample.sampleCounts[i];
      const sampleDelta = meta.timeToSample.sampleDeltas[i];

      for (let j = 0; j < sampleCount; j += 1) {
        if (k === 0) {
          decodingTimes[k] = 0;
        } else {
          decodingTimes[k] = decodingTimes[k - 1] + sampleDelta;
        }

        k += 1;
      }
    }

    // The composition offset box "ctts" is used when there are out-of-order
    // video samples (videos with B-frames).
    // The composition offset box "ctts" contains a sample-by-sample mapping of
    // the decode-to-presentation time. Each entry in the composition offset
    // table is a time delta from decode to presentation time:
    //
    //  CT(i) = DT(i) + CTTS(i)
    //
    // where
    //  CTTS(i) is the (uncompressed) table entry for sample i;
    //  DT is the decode time;
    //  CT is the composition (or display) time.
    // The delta expressed in the composition offset table can be positive
    // or negative.

    // Offsets in time units.
    const compositionOffsets = [];

    for (let i = 0; i < meta.compositionOffset.sampleCounts.length; i += 1) {
      const sampleCount = meta.compositionOffset.sampleCounts[i];
      const sampleOffset = meta.compositionOffset.sampleOffsets[i];

      for (let j = 0; j < sampleCount; j += 1) {
        compositionOffsets.push(sampleOffset);
      }
    }

    // Apply composition offsets to decoding times and convert time units into
    // real world time.

    const timestamps = [];

    for (let i = 0; i < decodingTimes.length; i += 1) {
      const decodingTime = decodingTimes[i];

      // If there is no offsets: CT(i) = DT(i)
      let compositionTime = decodingTime;

      // Apply composition offsets to decoding times if avaiable.
      if (compositionOffsets.length > 0) {
        const compositionOffset = compositionOffsets[i];

        compositionTime += compositionOffset;
      }

      const timestamp = compositionTime / meta.timescale;

      timestamps.push(timestamp + options.commonOffset);
    }

    // In case there are out-of-order samples (like in video with B-frames),
    // sort all timestamps ascending. Most likely developer who uses this helper
    // won't need unordered timestamps, so do it here to avoid confusion when
    // developer sees and uses unordered timestamps.
    timestamps.sort((a, b) => a - b);

    return timestamps;
  },

};

export default mp4Helper;
