import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { useApp } from '../../context/AppContext';

export const Button = ({
  children,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon = null,
  rightIcon = null,
  disabled = false,
  loading = false,
  fullWidth = false,
  style = {},
  textStyle = {},
  activeOpacity = 0.75
}) => {
  const { colors } = useApp();

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          container: {
            backgroundColor: disabled ? colors.border : colors.primary,
            borderWidth: 0
          },
          text: {
            color: '#ffffff'
          }
        };
      case 'secondary':
        return {
          container: {
            backgroundColor: colors.bgSubtle,
            borderWidth: 1,
            borderColor: colors.border
          },
          text: {
            color: colors.textMain
          }
        };
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderColor: colors.primary
          },
          text: {
            color: colors.primary
          }
        };
      case 'danger':
        return {
          container: {
            backgroundColor: colors.negativeLight,
            borderWidth: 1,
            borderColor: colors.negative
          },
          text: {
            color: colors.negative
          }
        };
      case 'ghost':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 0
          },
          text: {
            color: colors.primary
          }
        };
      default:
        return {
          container: {
            backgroundColor: colors.primary,
            borderWidth: 0
          },
          text: {
            color: '#ffffff'
          }
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          container: {
            height: 34,
            paddingHorizontal: 12,
            borderRadius: 17
          },
          text: {
            fontSize: 12,
            fontWeight: '700'
          },
          iconSize: 14
        };
      case 'lg':
        return {
          container: {
            height: 50,
            paddingHorizontal: 24,
            borderRadius: 25
          },
          text: {
            fontSize: 15,
            fontWeight: '800'
          },
          iconSize: 18
        };
      case 'md':
      default:
        return {
          container: {
            height: 42,
            paddingHorizontal: 18,
            borderRadius: 21
          },
          text: {
            fontSize: 13,
            fontWeight: '700'
          },
          iconSize: 16
        };
    }
  };

  const variantStyle = getVariantStyles();
  const sizeStyle = getSizeStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={activeOpacity}
      style={[
        styles.baseContainer,
        sizeStyle.container,
        variantStyle.container,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#ffffff' : colors.primary}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon && <View style={styles.leftIcon}>{icon}</View>}
          <Text style={[styles.baseText, sizeStyle.text, variantStyle.text, textStyle]}>
            {children}
          </Text>
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  fullWidth: {
    width: '100%'
  },
  disabled: {
    opacity: 0.6
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  leftIcon: {
    marginRight: 2
  },
  rightIcon: {
    marginLeft: 2
  },
  baseText: {
    textAlign: 'center',
    letterSpacing: 0.2
  }
});

