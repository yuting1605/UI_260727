import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function BlindSettingsScreen() {
  const router = useRouter();

  const [userName, setUserName] = useState("載入中...");
  const [userAccount, setUserAccount] = useState("");
  const [userRole, setUserRole] = useState("視障者");

  // 每次回到畫面時自動刷新 AsyncStorage 中的資料
  useFocusEffect(
    useCallback(() => {
      const loadUserData = async () => {
        try {
          const storedName = await AsyncStorage.getItem("userName");
          const storedAccount = await AsyncStorage.getItem("userAccount");
          const storedRole = await AsyncStorage.getItem("userRole");

          if (storedName) setUserName(storedName);
          if (storedAccount) setUserAccount(storedAccount);
          if (storedRole) setUserRole(storedRole);
        } catch (error) {
          console.error("讀取身分資料失敗:", error);
        }
      };

      loadUserData();
    }, [])
  );

  const handleLogout = () => {
    Alert.alert("確認", "確定要登出系統嗎？", [
      { text: "取消", style: "cancel" },
      {
        text: "登出",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.clear();
          router.replace("/");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* 💡 身份顯示卡片 */}
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={32} color="#000000" />
        </View>

        <View style={styles.profileInfo}>
          <Text
            style={styles.userName}
            numberOfLines={1}
            accessible={true}
            accessibilityLabel={`顯示名稱：${userName}`}
          >
            {userName}
          </Text>

          <Text
            style={styles.userAccount}
            accessible={true}
            accessibilityLabel={`帳號：${userAccount || "無"}`}
          >
            {userAccount ? `帳號：${userAccount}` : ""}
          </Text>

          <View
            style={styles.roleBadge}
            accessible={true}
            accessibilityLabel={`身分：${userRole}`}
          >
            <Ionicons name="eye-outline" size={14} color="#000000" style={{ marginRight: 4 }} />
            <Text style={styles.roleText}>{userRole}</Text>
          </View>
        </View>
      </View>

      {/* ✏️ 編輯個人資料按鈕（無箭頭、置中卡片） */}
      <TouchableOpacity
        style={styles.settingItem}
        onPress={() => router.push("/blind/edit-name")}
        accessible={true}
        accessibilityLabel="編輯個人資料"
        accessibilityHint="點擊後開啟修改名稱頁面"
        accessibilityRole="button"
      >
        <Ionicons name="create-outline" size={22} color="#000000" style={{ marginRight: 8 }} />
        <Text style={styles.settingText}>編輯個人資料</Text>
      </TouchableOpacity>

      {/* ❓ 常見問題按鈕（無箭頭、置中卡片） */}
      <TouchableOpacity
        style={styles.settingItem}
        onPress={() => router.push("/blind/faq")}
        accessible={true}
        accessibilityLabel="常見問題與說明"
        accessibilityHint="點擊開啟常見問題與說明頁面"
        accessibilityRole="button"
      >
        <Ionicons name="help-circle-outline" size={22} color="#000000" style={{ marginRight: 8 }} />
        <Text style={styles.settingText}>常見問題與說明</Text>
      </TouchableOpacity>

      {/* 🚪 登出系統按鈕 */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        accessible={true}
        accessibilityLabel="登出系統"
        accessibilityHint="點擊後將彈出確認視窗並清除登入狀態"
        accessibilityRole="button"
      >
        <Ionicons name="log-out-outline" size={22} color="#FF3B30" style={{ marginRight: 8 }} />
        <Text style={styles.logoutText}>登出</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 30,
    backgroundColor: "#F2F2F7",
  },

  // 身分顯示卡片樣式
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E5E5EA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
    justifyContent: "center",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 2,
  },
  userAccount: {
    fontSize: 13,
    color: "#8E8E93",
    marginBottom: 8,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#E5E5EA",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
  },

  // ✏️ 與 ❓ 通用卡片按鈕樣式（照護端同款：柔和陰影、無黑框、置中對齊）
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  settingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
  },

  // 🚪 登出按鈕樣式
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF3B30",
  },
});