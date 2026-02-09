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
import { FileDown } from 'lucide-react';

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
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e1b4b',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 12,
        color: '#64748b',
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: '#f1f5f9',
        padding: 8,
        marginBottom: 10,
        borderRadius: 4,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    label: {
        width: 120,
        fontWeight: 'bold',
        fontSize: 10,
        color: '#475569',
    },
    value: {
        flex: 1,
        fontSize: 10,
        color: '#1e293b',
    },
    description: {
        fontSize: 10,
        lineHeight: 1.6,
        color: '#334155',
        marginTop: 10,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: 'center',
        fontSize: 8,
        color: '#94a3b8',
        borderTop: 1,
        borderTopColor: '#e2e8f0',
        paddingTop: 10,
    },
    badge: {
        padding: 4,
        borderRadius: 4,
        fontSize: 9,
        fontWeight: 'bold',
    },
    easy: { backgroundColor: '#dcfce7', color: '#166534' },
    medium: { backgroundColor: '#fef9c3', color: '#854d0e' },
    hard: { backgroundColor: '#ffedd5', color: '#9a3412' },
    insane: { backgroundColor: '#fee2e2', color: '#991b1b' },
});

interface ChallengeReportData {
    id: string;
    title: string;
    slug: string;
    difficulty: 'easy' | 'medium' | 'hard' | 'insane';
    description: string;
    tags: string[];
    solveCount: number;
    currentPoints: number;
    initialPoints: number;
    isSolved: boolean;
    solvedAt?: string;
    pointsAwarded?: number;
    authorName?: string;
    createdAt: string;
}

function ChallengePDFDocument({ challenge }: { challenge: ChallengeReportData }) {
    const difficultyStyle = styles[challenge.difficulty] || styles.easy;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>{challenge.title}</Text>
                    <Text style={styles.subtitle}>Challenge Report • CTF Platform</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Challenge Information</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Challenge ID:</Text>
                        <Text style={styles.value}>{challenge.id}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Slug:</Text>
                        <Text style={styles.value}>{challenge.slug}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Difficulty:</Text>
                        <Text style={[styles.value, difficultyStyle]}>
                            {challenge.difficulty.toUpperCase()}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Tags:</Text>
                        <Text style={styles.value}>{challenge.tags.join(', ') || 'None'}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Author:</Text>
                        <Text style={styles.value}>{challenge.authorName || 'Unknown'}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Created:</Text>
                        <Text style={styles.value}>
                            {new Date(challenge.createdAt).toLocaleDateString()}
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.description}>{challenge.description}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Scoring Information</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Initial Points:</Text>
                        <Text style={styles.value}>{challenge.initialPoints}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Current Points:</Text>
                        <Text style={styles.value}>{challenge.currentPoints}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Total Solves:</Text>
                        <Text style={styles.value}>{challenge.solveCount}</Text>
                    </View>
                </View>

                {challenge.isSolved && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Your Solution</Text>
                        <View style={styles.row}>
                            <Text style={styles.label}>Status:</Text>
                            <Text style={[styles.value, { color: '#166534' }]}>SOLVED</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Solved On:</Text>
                            <Text style={styles.value}>
                                {challenge.solvedAt
                                    ? new Date(challenge.solvedAt).toLocaleDateString()
                                    : 'N/A'}
                            </Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Points Awarded:</Text>
                            <Text style={styles.value}>{challenge.pointsAwarded || challenge.currentPoints}</Text>
                        </View>
                    </View>
                )}

                <View style={styles.footer}>
                    <Text>
                        Generated by CTF Platform • {new Date().toLocaleDateString()}
                    </Text>
                    <Text>Confidential - For authorized use only</Text>
                </View>
            </Page>
        </Document>
    );
}

interface ChallengeReportPDFProps {
    challenge: ChallengeReportData;
}

export function ChallengeReportPDF({ challenge }: ChallengeReportPDFProps) {
    const fileName = `challenge-${challenge.slug}-report.pdf`;

    return (
        <PDFDownloadLink
            document={<ChallengePDFDocument challenge={challenge} />}
            fileName={fileName}
        >
            {({ loading }) => (
                <Button variant="outline" size="sm" disabled={loading}>
                    <FileDown className="h-4 w-4 mr-2" />
                    {loading ? 'Generating PDF...' : 'Export Report'}
                </Button>
            )}
        </PDFDownloadLink>
    );
}
