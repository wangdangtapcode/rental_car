package com.springboot.backend.Utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.logging.Level;

/**
 * Utility class for logging operations throughout the application.
 */
public class LogUtils {

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    // Log levels
    public static final String INFO = "INFO";
    public static final String WARNING = "WARNING";
    public static final String ERROR = "ERROR";
    public static final String DEBUG = "DEBUG";

    /**
     * Log a message with specified level
     *
     * @param className Name of the class where logging occurs
     * @param methodName Name of the method where logging occurs
     * @param message Message to log
     * @param level Logging level
     */
    public static void log(String className, String methodName, String message, String level) {
        String timestamp = LocalDateTime.now().format(formatter);
        String logMessage = String.format("[%s] [%s] %s.%s: %s",
                timestamp, level, className, methodName, message);

        // Print to console (can be modified to write to file or use a logging framework)
        System.out.println(logMessage);
    }

    /**
     * Log an exception with error level
     *
     * @param className Name of the class where exception occurs
     * @param methodName Name of the method where exception occurs
     * @param message Message to log
     * @param exception The exception to log
     */
    public static void logException(String className, String methodName, String message, Exception exception) {
        StringWriter sw = new StringWriter();
        exception.printStackTrace(new PrintWriter(sw));
        String stackTrace = sw.toString();

        log(className, methodName, message + "\nStack trace: " + stackTrace, ERROR);
    }

    /**
     * Log an info message
     */
    public static void info(String className, String methodName, String message) {
        log(className, methodName, message, INFO);
    }

    /**
     * Log a warning message
     */
    public static void warning(String className, String methodName, String message) {
        log(className, methodName, message, WARNING);
    }

    /**
     * Log an error message
     */
    public static void error(String className, String methodName, String message) {
        log(className, methodName, message, ERROR);
    }

    /**
     * Log a debug message
     */
    public static void debug(String className, String methodName, String message) {
        log(className, methodName, message, DEBUG);
    }
}