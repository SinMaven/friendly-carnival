'use client';

import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    PDFDownloadLink,
} from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        borderBottom: 2,
        borderBottomColor: '#6366f1',
        paddingBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e1b4b',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 12,
        color: '#64748b',
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#f8fafc',
        padding: 15,
        borderRadius: 8,
        border: 1,
        borderColor: '#e2e8f0',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4f46e5',
    },
    statLabel: {
        fontSize: 10,
        color: '#64748b',
        marginTop: 4,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        backgroundColor: '#4f46e5',
        color: '#ffffff',
        padding: 10,
        marginBottom: 10,
        borderRadius: 4,
    },
    table: {
        border: 1,
        borderColor: '#e2e8f0',
        borderRadius: 4,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f1f5f9',
        padding: 8,
        borderBottom: 1,
        borderBottomColor: '#e2e8f0',
    },
    tableRow: {
        flexDirection: 'row',
        padding: 8,
        borderBottom: 1,
        borderBottomColor: '#e2e8f0',
    },
    tableCell: {
        fontSize: 9,
        color: '#334155',
    },
    colChallenge: { flex: 3 },
    colCategory: { flex: 2 },
    colDifficulty: { flex: 1.5 },
    colPoints: { flex: 1 },
    colDate: { flex: 2 },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: 'center',
        fontSize: 8,
        color: '#94a3b8',
    },
    text: {
        fontSize: 10,
        lineHeight: 1.5,
        color: '#334155',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    label: {
        width: 100,
        fontWeight: 'bold',
        fontSize: 10,
        color: '#475569',
    },
    value: {
        flex: 1,
        fontSize: 10,
        color: '#1e293b',
    },
});

interface SolveData {
    challengeId: string;
    challengeTitle: string;
    category: string;
    difficulty: string;
    points: number;
    solvedAt: string;
}

interface UserProgressData {
    userId: string;
    username: string;
    fullName?: string;
    rank: number;
    totalPoints: number;
    totalSolves: number;
    joinDate: string;
    solves: SolveData[];
    teamName?: string;
}

function UserProgressPDFDocument({ data }: { data: UserProgressData }) {
    const solveRate = data.solves.length > 0
        ? ((data.solves.length / (data.solves.length + 10)) * 100).toFixed(1)
        : '0';

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>Progress Report</Text>
                    <Text style={styles.subtitle}>
                        {data.fullName || data.username} • CTF Platform
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>User Profile</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Username:</Text>
                        <Text style={styles.value}>{data.username}</Text>
                    </View>
                    {data.fullName && (
                        <View style={styles.row}>
                            <Text style={styles.label}>Full Name:</Text>
                            <Text style={styles.value}>{data.fullName}</Text>
                        </View>
                    )}
                    {data.teamName && (
                        <View style={styles.row}>
                            <Text style={styles.label}>Team:</Text>
                            <Text style={styles.value}>{data.teamName}</Text>
                        </View>
                    )}
                    <View style={styles.row}>
                        <Text style={styles.label}>Member Since:</Text>
                        <Text style={styles.value}>
                            {new Date(data.joinDate).toLocaleDateString()}
                        </Text>
                    </View>
                </View>

                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>#{data.rank}</Text>
                        <Text style={styles.statLabel}>Global Rank</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{data.totalPoints}</Text>
                        <Text style={styles.statLabel}>Total Points</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{data.totalSolves}</Text>
                        <Text style={styles.statLabel}>Challenges Solved</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{solveRate}%</Text>
                        <Text style={styles.statLabel}>Success Rate</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Solved Challenges</Text>
                    {data.solves.length > 0 ? (
                        <View style={styles.table}>
                            <View style={styles.tableHeader}>
                                <Text style={[styles.tableCell, styles.colChallenge]}>Challenge</Text>
                                <Text style={[styles.tableCell, styles.colCategory]}>Category</Text>
                                <Text style={[styles.tableCell, styles.colDifficulty]}>Difficulty</Text>
                                <Text style={[styles.tableCell, styles.colPoints]}>Points</Text>
                                <Text style={[styles.tableCell, styles.colDate]}>Date</Text>
                            </View>
                            {data.solves.map((solve, index) => (
                                <View key={index} style={styles.tableRow}>
                                    <Text style={[styles.tableCell, styles.colChallenge]}>
                                        {solve.challengeTitle}
                                    </Text>
                                    <Text style={[styles.tableCell, styles.colCategory]}>
                                        {solve.category}
                                    </Text>
                                    <Text style={[styles.tableCell, styles.colDifficulty]}>
                                        {solve.difficulty}
                                    </Text>
                                    <Text style={[styles.tableCell, styles.colPoints]}>
                                        {solve.points}
                                    </Text>
                                    <Text style={[styles.tableCell, styles.colDate]}>
                                        {new Date(solve.solvedAt).toLocaleDateString()}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text style={styles.text}>No challenges solved yet.</Text>
                    )}
                </View>

                <View style={styles.footer}>
                    <Text>
                        Generated on {new Date().toLocaleDateString()} by CTF Platform
                    </Text>
                    <Text>Report ID: {data.userId.slice(0, 8)}</Text>
                </View>
            </Page>
        </Document>
    );
}

interface UserProgressReportPDFProps {
    data: UserProgressData;
}

export function UserProgressReportPDF({ data }: UserProgressReportPDFProps) {
    const fileName = `progress-report-${data.username}.pdf`;

    return (
        <PDFDownloadLink
            document={<UserProgressPDFDocument data={data} />}
            fileName={fileName}
        >
            {({ loading }) => (
                <Button variant="outline" size="sm" disabled={loading}>
                    <Trophy className="h-4 w-4 mr-2" />
                    {loading ? 'Generating...' : 'Export Progress'}
                </Button>
            )}
        </PDFDownloadLink>
    );
}
