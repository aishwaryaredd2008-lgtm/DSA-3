package com.aqb.dsa;

public class KmpDuplicateDetector {

    public static int[] computeLPSArray(String pattern) {
        int m = pattern.length();
        int[] lps = new int[m];
        int len = 0;
        int i = 1;

        while (i < m) {
            if (Character.toLowerCase(pattern.charAt(i)) == Character.toLowerCase(pattern.charAt(len))) {
                len++;
                lps[i] = len;
                i++;
            } else {
                if (len != 0) {
                    len = lps[len - 1];
                } else {
                    lps[i] = 0;
                    i++;
                }
            }
        }
        return lps;
    }

    public static boolean containsSubstring(String text, String pattern) {
        if (pattern == null || pattern.isEmpty() || text == null) return false;
        String txt = text.toLowerCase();
        String pat = pattern.toLowerCase();
        int n = txt.length();
        int m = pat.length();
        if (m > n) return false;

        int[] lps = computeLPSArray(pat);
        int i = 0;
        int j = 0;

        while (i < n) {
            if (pat.charAt(j) == txt.charAt(i)) {
                i++;
                j++;
            }
            if (j == m) {
                return true;
            } else if (i < n && pat.charAt(j) != txt.charAt(i)) {
                if (j != 0) {
                    j = lps[j - 1];
                } else {
                    i++;
                }
            }
        }
        return false;
    }
}
