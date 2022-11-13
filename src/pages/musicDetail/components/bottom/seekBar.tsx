import React, {useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import rpx from '@/utils/rpx';
import Slider from '@react-native-community/slider';
import MusicQueue from '@/core/musicQueue';
import timeformat from '@/utils/timeformat';
import {fontSizeConst} from '@/constants/uiConst';

interface ITimeLabelProps {
    time: number;
}

function TimeLabel(props: ITimeLabelProps) {
    return <Text style={style.text}>{timeformat(props.time)}</Text>;
}

export default function SeekBar() {
    const progress = MusicQueue.useProgress(1000);
    const [tmpProgress, setTmpProgress] = useState<number | null>(null);
    const slidingRef = useRef(false);

    return (
        <View style={style.wrapper}>
            <TimeLabel time={tmpProgress ?? progress.position} />
            <Slider
                style={style.slider}
                minimumTrackTintColor={'#cccccc'}
                maximumTrackTintColor={'#999999'}
                thumbTintColor={'#dddddd'}
                minimumValue={0}
                maximumValue={progress.duration}
                onSlidingStart={() => {
                    slidingRef.current = true;
                }}
                onValueChange={val => {
                    if (slidingRef.current) {
                        setTmpProgress(val);
                    }
                }}
                onSlidingComplete={val => {
                    slidingRef.current = false;
                    setTmpProgress(null);
                    if (val >= progress.duration - 3) {
                        val = progress.duration - 3;
                    }
                    MusicQueue.seekTo(val);
                }}
                value={progress.position}
            />
            <TimeLabel time={progress.duration} />
        </View>
    );
}

const style = StyleSheet.create({
    wrapper: {
        width: rpx(750),
        height: rpx(40),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    slider: {
        width: rpx(550),
        height: rpx(40),
    },
    text: {
        fontSize: fontSizeConst.description,
        includeFontPadding: false,
        color: '#cccccc',
    },
});
