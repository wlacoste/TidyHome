import React, { useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Config from 'react-native-config';
import { useCategories } from '../../context/categoryContext';

const fetchApodData = async () => {
  const response = await axios.get('https://api.nasa.gov/planetary/apod', {
    params: {
      api_key: Config.API_KEY,
    },
  });
  return response.data;
};

const NasaApodComponent = () => {
  const {
    data: apodData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['apod'],
    queryFn: fetchApodData,
  });
  const theme = useTheme();
  // const { categories } = useCategories();

  // useEffect(() => {
  //   console.log(categories);
  // }, [categories]);

  // console.log(apodData);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          style={styles.loading}
          animating={true}
          size={'large'}
        />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
        <Text style={styles.retryText} onPress={() => refetch()}>
          Tap to retry
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }>
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>
        {apodData.title}
      </Text>
      <Image
        source={{ uri: apodData.url }}
        style={styles.image}
        resizeMode="center"
      />
      <Text style={[styles.date, { color: theme.colors.onSurface }]}>
        {apodData.date}
      </Text>
      <Text style={styles.explanation}>{apodData.explanation}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    paddingTop: 0,
  },
  title: {
    fontSize: 20,
    lineHeight: 20,
    fontWeight: 'bold',
    marginBottom: 0,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    marginBottom: 10,
    borderRadius: 10,
  },
  date: {
    fontSize: 16,
    marginBottom: 10,
  },
  explanation: {
    fontSize: 14,
    textAlign: 'justify',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
  },
  retryText: {
    color: 'blue',
    fontSize: 16,
  },
});

export default NasaApodComponent;
