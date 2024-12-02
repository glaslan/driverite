import React, { useState } from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import { Button, DataTable, Divider, Icon, IconButton } from 'react-native-paper';
import PagerView from 'react-native-pager-view';

export default function ViewTripProgress({ recentTrip, setShowTripSummary }) {
  const [activePage, setActivePage] = useState(0); // State to track the active page

  function getMessage(value) {
    if (value >= 95) return "Excellent work!";
    else if (value >= 80) return "Good job!";
    else if (value >= 70) return "You did ok...";
    else if (value >= 50) return "You barely made it...";
    else return "You displayed horrible diving!";
  }

  function getMessageColor(value) {
    if (value >= 95) return "#0f8000";
    else if (value >= 80) return "#89e03b";
    else if (value >= 70) return "orange";
    else if (value >= 50) return "red";
    else return "#9d1818";
  }

  function getMessageIcon(value) {
    if (value >= 95) return "star-circle";
    else if (value >= 80) return "check-circle";
    else if (value >= 70) return "minus-circle";
    else if (value >= 50) return "alert-circle";
    else return "close-circle";
  }

  const InfoCard = ({ typescore }) => {
    let title;
    let info;
    if (typescore == 'braking') {
      title = <Text style={{fontSize: 18, fontWeight: 600, marginTop: 5}}>Braking</Text>;
      info = <Text style={{fontSize: 16, fontWeight: 400, marginBottom: 5}}>Your braking is hard, we suggest taking your time with it.</Text>;
    }
    if (typescore == 'speed') {
      title = <Text style={{fontSize: 18, fontWeight: 600, marginTop: 5}}>Speed</Text>;
      info = <Text style={{fontSize: 16, fontWeight: 400, marginBottom: 5}}>Your speed isn't great, follow the speed limits displayed.</Text>;
    }
    if (typescore == 'cornering') {
      title = <Text style={{fontSize: 18, fontWeight: 600, marginTop: 5}}>Cornering</Text>;
      info = <Text style={{fontSize: 16, fontWeight: 400, marginBottom: 5}}>You seem to be taking turns badly, we suggest you take your time with it.</Text>;
    }
    if (typescore == 'acceleration') {
      title = <Text style={{fontSize: 18, fontWeight: 600, marginTop: 5}}>Acceleration</Text>;
      info = <Text style={{fontSize: 16, fontWeight: 400, marginBottom: 5}}>Your acceleration isn't great, accelerate at a different rate from what you were.</Text>;
    }
    if (typescore == 'all-good') {
      title = <Text style={{fontSize: 18, fontWeight: 600, marginTop: 5}}>Great job</Text>;
      info = <Text style={{fontSize: 16, fontWeight: 400, marginBottom: 5}}>According to the score calculators, you're doing amazing!.</Text>;
    }
    return (
      <View>
        {title}
        {info}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", marginTop: "20%" }}>
        <IconButton
          icon="arrow-left"
          iconColor="rgba(0,0,0,0)"
          size={30}
          onPress={() => { setShowTripSummary(false) }}
        />

        <Text style={{ color: "black", fontSize: 30, textAlign: "center", flex: 1 }}>
          Trip Summary
        </Text>

        <IconButton
          icon="arrow-left"
          iconColor="rgba(0,0,0,0)"
          size={30}
          onPress={() => { }}
        />
      </View>

      <View style={styles.progressContainer}>
        <View style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 25 }}>
          <Icon
            source={getMessageIcon(recentTrip.score)}
            color={getMessageColor(recentTrip.score)}
            size={100}
          />
          <Text style={{ fontSize: 18, fontWeight: 600, marginTop: 5 }}>{getMessage(recentTrip.score)}</Text>
        </View>
      </View>

      <PagerView
        style={styles.viewPager}
        initialPage={0}
        onPageSelected={(e) => setActivePage(e.nativeEvent.position)}
      >
        {/* Table window */}
        <View style={styles.page}>
          <View style={styles.tableContainer}>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Stat</DataTable.Title>
                <DataTable.Title numeric>Score</DataTable.Title>
              </DataTable.Header>

              <DataTable.Row>
                <DataTable.Cell>Overall</DataTable.Cell>
                <DataTable.Cell numeric><Text style={{fontWeight: 800}}>{recentTrip.score}%</Text></DataTable.Cell>
              </DataTable.Row>

              <DataTable.Row>
                <DataTable.Cell>Acceleration</DataTable.Cell>
                <DataTable.Cell numeric>{recentTrip.acceleration}%</DataTable.Cell>
              </DataTable.Row>

              <DataTable.Row>
                <DataTable.Cell>Speed</DataTable.Cell>
                <DataTable.Cell numeric>{recentTrip.speed}%</DataTable.Cell>
              </DataTable.Row>

              <DataTable.Row>
                <DataTable.Cell>Cornering</DataTable.Cell>
                <DataTable.Cell numeric>{recentTrip.cornering}%</DataTable.Cell>
              </DataTable.Row>

              <DataTable.Row>
                <DataTable.Cell>Braking</DataTable.Cell>
                <DataTable.Cell numeric>{recentTrip.braking}%</DataTable.Cell>
              </DataTable.Row>
            </DataTable>
          </View>
        </View>

        {/* Bad habits window */}
        <View style={styles.page}>
          <Text style={styles.Title}>Bad Habits</Text>
          <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {recentTrip.braking < 70 && <InfoCard typescore="braking" />}
            {recentTrip.acceleration < 70 && <InfoCard typescore="acceleration" />}
            {recentTrip.speed < 70 && <InfoCard typescore="speed" />}
            {recentTrip.cornering < 70 && <InfoCard typescore="cornering" />}
            {recentTrip.braking >= 70 && recentTrip.acceleration >= 70 && recentTrip.speed >= 70 && recentTrip.cornering >= 70 && (
              <InfoCard typescore="all-good" />
            )}
            <InfoCard typescore="acceleration" />
            <InfoCard typescore="speed" />
            <InfoCard typescore="cornering" />
          </ScrollView>
        </View>
      </PagerView>

        <View style={{position: "absolute", bottom: 70, width: "90%", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <Divider bold style={{ top: 1, width: "100%"}} />
            <View style={styles.pageIndicators}>
                <View
                style={[
                    styles.pageIndicator,
                    activePage === 0 ? styles.activeIndicator : styles.inactiveIndicator,
                ]}
                />
                <View
                style={[
                    styles.pageIndicator,
                    activePage === 1 ? styles.activeIndicator : styles.inactiveIndicator,
                ]}
                />
            </View>
            <Button icon="arrow-left" mode="contained" textColor="white" style={{width: "100%", height: 50, justifyContent: "center", alignContent: "center", top: 40}} onPress={() => {setShowTripSummary(false)}}>
                Back Home
            </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewPager: {
    width: '100%',
    flex: 1,
    marginTop: 10
  },
  page: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  progressContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 400,
  },
  tableContainer: {
    width: '100%',
    justifyContent: 'center',
  },
  pageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15
  },
  pageIndicator: {
    width: 10,
    height: 10,
    margin: 5,
    borderRadius: 5,
  },
  activeIndicator: {
    backgroundColor: '#663399',
  },
  inactiveIndicator: {
    backgroundColor: '#CCCCCC',
  },
  scrollContainer: {
    width: 350,
    maxHeight: 250,
    overflow: "hidden",
  },
  scrollContent: {
    justifyContent: 'flex-start',
  },
  Title: {
    marginTop: 10,
    marginBottom: 5,
    fontSize: 20,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 15,
    flexWrap: 'wrap',
    maxWidth: '95%',
  },
});
