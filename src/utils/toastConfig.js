import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-paper';

export const toastConfig = theme => ({
  success: props => (
    <CustomToast
      {...props}
      props={{ ...props.props, icon: 'check-circle' }}
      theme={theme}
    />
  ),

  error: props => (
    <CustomToast
      {...props}
      props={{ ...props.props, icon: 'close-circle' }}
      theme={theme}
    />
  ),
  info: props => (
    <CustomToast
      {...props}
      props={{ ...props.props, icon: 'information' }}
      theme={theme}
    />
  ),
  tomatoToast: props => <CustomToast {...props} theme={theme} />,
});

const CustomToast = ({ props, text1, text2, theme }) => {
  return (
    <View
      style={{
        marginTop: -10,
        height: 60,
        width: '90%',
        borderRadius: 8,
        borderWidth: 0.5,
        borderColor: theme.colors.toastPrimary,
        backgroundColor: theme.colors.toastBack,
        justifyContent: 'center',
        paddingHorizontal: 15,
        paddingVertical: 0,
      }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 12,
        }}>
        <View style={styles.icono}>
          <Icon
            source={props.icon}
            color={theme.colors.toastPrimary}
            size={20}
          />
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '90%',
          }}>
          <Text
            style={{
              color: theme.colors.toastText,
              fontSize: 15,
            }}
            numberOfLines={text2 ? 1 : 2}
            ellipsizeMode="tail">
            {text1}
          </Text>
          {text2 && (
            <Text
              style={{ color: theme.colors.toastText, fontSize: 12 }}
              numberOfLines={1}
              ellipsizeMode="tail">
              {text2}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  icono: {
    justifyContent: 'center',
  },
});
