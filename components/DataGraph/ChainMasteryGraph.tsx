import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  VictoryAxis,
  VictoryChart,
  VictoryContainer,
  VictoryLabel,
  VictoryLegend,
  VictoryLine,
  VictoryScatter,
  VictoryTheme,
} from 'victory-native';
import { GraphData, HandleGraphPopulation, SetGraphData } from '../../_util/CreateGraphData';
import { CB_NAME, PROBE_NAME, TRAINING_NAME } from '../../constants/chainshome_text';
import { useChainMasteryState } from '../../context/ChainMasteryProvider';
import CustomColors from '../../styles/Colors';

interface ChainMasteryGraphProps {
  width: number;
  height: number;
  margin: number;
}

const ChainMasteryGraph = (props: ChainMasteryGraphProps): JSX.Element => {
  const chainMasteryState = useChainMasteryState();
  const [graphData, setGraphData] = useState<GraphData[]>();
  const { width, height, margin } = props;

  // Runs when chain mastery state is updated.
  useEffect(() => {
    let isCancelled = false;

    const _load = async () => {
      if (!isCancelled && chainMasteryState.chainMastery) {
        const calculatedDataArray = SetGraphData(chainMasteryState.chainMastery.chainData.sessions);
        if (calculatedDataArray) {
          const emptyGraphData: GraphData[] = [
            {
              data: [],
              name: PROBE_NAME,
              x: 'session_number',
              y: 'mastery',
              color: CustomColors.uva.cyan,
              type: 'scatter',
            },
            {
              data: [],
              name: TRAINING_NAME,
              x: 'session_number',
              y: 'mastery',
              color: CustomColors.uva.redEmergency,
              type: 'line',
            },
            {
              data: [],
              name: CB_NAME,
              x: 'session_number',
              y: 'challenging_behavior',
              color: CustomColors.uva.orange,
              type: 'line',
            },
          ];
          const newGraphData = HandleGraphPopulation(graphData || emptyGraphData, calculatedDataArray);
          setGraphData(newGraphData);
        }
      }
    };

    _load();

    return () => {
      isCancelled = true;
    };
  }, [chainMasteryState.chainMastery && chainMasteryState.chainMastery.chainData.sessions]);

  const styles = StyleSheet.create({
    container: {
      width: width,
      height: height,
      justifyContent: 'center',
      alignItems: 'flex-start',
      flexDirection: 'column',
    },
    titleContainer: {
      width: width - margin * 2,
      justifyContent: 'flex-end',
      alignItems: 'flex-start',
      flexDirection: 'column',
      marginTop: margin / 2,
      marginBottom: margin,
      marginLeft: margin,
    },
    title: {
      fontWeight: 'bold',
      fontSize: 18,
    },
    axisLabel: {
      fontWeight: 'bold',
      fontSize: 12,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{'Progress'}</Text>
      </View>
      {chainMasteryState.chainMastery && graphData && (
        <VictoryContainer width={width} height={height - margin * 4}>
          <VictoryChart
            padding={{ top: margin, bottom: margin * 5, left: margin * 5, right: margin * 2 }}
            height={width}
            width={width}
            theme={VictoryTheme.material}
            domain={{ x: [1, chainMasteryState.chainMastery.chainData.sessions.length || 1], y: [0, 100] }}
          >
            <VictoryAxis
              crossAxis
              label={'Session #'}
              tickFormat={(t) => `${Math.floor(t)}`}
              tickCount={Math.min(5, chainMasteryState.chainMastery.chainData.sessions.length || 1)}
              axisLabelComponent={<VictoryLabel dy={24} style={styles.axisLabel} />}
            />
            <VictoryAxis
              dependentAxis
              tickFormat={(t) => `${Math.round(t)}%`}
              axisLabelComponent={<VictoryLabel dy={-24} style={styles.axisLabel} />}
            />
            {graphData.map((group, i) => {
              return group.type === 'line' ? (
                <VictoryLine
                  key={'graph-data-line-' + i}
                  interpolation={'linear'}
                  data={group.data}
                  x={group.x}
                  y={group.y}
                  style={{ data: { stroke: group.color, strokeWidth: 4 } }}
                />
              ) : (
                <VictoryScatter
                  key={'graph-data-scatter-' + i}
                  data={group.data}
                  x={group.x}
                  y={group.y}
                  size={5}
                  style={{ data: { fill: group.color } }}
                />
              );
            })}
          </VictoryChart>
          <VictoryLegend
            x={margin * 4}
            y={margin}
            width={width}
            height={105}
            orientation={'vertical'}
            rowGutter={{ top: -2, bottom: -4 }}
            gutter={20}
            style={{ border: { stroke: CustomColors.uva.grayMedium }, title: { fontSize: 16, lineHeight: 1 } }}
            data={graphData.map((group) => {
              return {
                name: group.name,
                symbol: { fill: group.color },
              };
            })}
          />
        </VictoryContainer>
      )}
    </View>
  );
};

export default ChainMasteryGraph;
